const jwt = require("jsonwebtoken");
const config = require("config");
exports.verifyAuthenticationCustomer = async (req, res, next)=>{
    try {
        const {token} = req.headers;
        if(token){
            const verifyToken = token.split(" ")[1];
            jwt.verify(
                verifyToken,
                config.get("app.jwtAccessKey"),
                (error, customer)=>{
                    if(error){
                        if(error.name==="TokenExpiredError") return res.status(401).json("Token expired");                        
                        return res.status(401).json("Authentication required");
                    }
                    next();
                }
            );   
        }
        else{
            return res.status(401).json("Authentication required");
        }
        
    } catch (error) {
        return res.status(500).json(error);
    }
}