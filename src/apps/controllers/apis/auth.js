const CustomerModel = require("../../models/customers");
const TokenModel = require("../../models/token");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const config = require("config");
const { redisClient } = require("../../../common/init.redis");
const generateAccessToken = (customer) => {
  return jwt.sign({ _id: customer._id }, config.get("app.jwtAccessKey"), {
    expiresIn: "20s",
  });
};
const generateRefreshToken = (customer) => {
  return jwt.sign({ _id: customer._id }, config.get("app.jwtRefreshKey"), {
    expiresIn: "1y",
  });
};
const setTokenBlacklist = (token) => {
  const decoded = jwtDecode(token);
  if (decoded.exp > Date.now() / 1000) {
    redisClient.set(token, token, {
      EXAT: decoded.exp,
    });
  }
};
module.exports = {
  registerCustomer: async (req, res) => {
    try {
      const { body } = req;
      const isCustomer = await CustomerModel.findOne({
        email: body.email,
      });
      if (isCustomer) return res.status(400).json("email exists");
      const isPhone = await CustomerModel.findOne({
        phone: body.phone,
      });
      if (isPhone) return res.status(400).json("phone exists");
      const customer = {
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        phone: body.phone,
        address: body.address,
      };
      await new CustomerModel(customer).save();
      return res.status(200).json("create customer successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  loginCustomer: async (req, res) => {
    try {
      const { body } = req;
      const isCustomer = await CustomerModel.findOne({
        email: body.email,
      });
      if (!isCustomer) return res.status(400).json("email not valid");
      const isPassword = body.password === isCustomer.password;
      if (!isPassword) return res.status(400).json("password not valid");
      if (isCustomer && isPassword) {
        const accessToken = generateAccessToken(isCustomer);
        const refreshToken = generateRefreshToken(isCustomer);
        const { password, ...others } = isCustomer._doc;
        /*
          Kiểm tra xem trước đó user đã có token hay chưa
          Nếu chưa thì thêm mới token
          Nếu đã có rồi thì chuyển token cũ vào redis và lưu token mới
        */
        const isTokenInDB = await TokenModel.findOne({
          customerId: isCustomer._id,
        });

        if (isTokenInDB) {
          // Move Token to Redis
          setTokenBlacklist(isTokenInDB.accessToken);

          // Delete old Token
          await TokenModel.deleteOne();
        }
        // Insert new Token to Database
        await new TokenModel({
          accessToken,
          refreshToken,
          customerId: isCustomer._id,
        }).save();

        // Return Token to client
        res.cookie("refreshToken", refreshToken);
        return res.status(200).json({
          customer: others,
          accessToken,
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  logoutCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const isCustomer = await TokenModel.findOne({
        customerId: id,
      });

      // Move token to redis
      setTokenBlacklist(isCustomer.accessToken);
      // Delete from database
      await TokenModel.deleteOne({
        customerId: id,
      });
      return res.status(200).json("logged out successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.cookies;
      jwt.verify(
        refreshToken,
        config.get("app.jwtRefreshKey"),
        async (error, customer) => {
          if (error) return res.status(401).json("Authentication required");
          const newAccessToken = generateAccessToken(customer);
          // update accessToken then refreshToken
          await TokenModel.updateOne(
            { refreshToken },
            { accessToken: newAccessToken }
          );
          return res.status(200).json({
            accessToken: newAccessToken,
          });
        }
      );
    } catch (error) {
      return res.status().json(error);
    }
  },
};
