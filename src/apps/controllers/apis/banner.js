const BannerModel = require("../../models/banner");
module.exports = {
    index: async (req, res)=>{
        try {
            const query = {};
            query.publish = true;
            const sort = Number(req.query.sort) || 1;
            const limit = Number(req.query.limit) || 6;
            const banners = await BannerModel.find(query)
                .sort({position: sort})
                .limit(limit);
            return res.status(200).json({
                status: "success",
                data:{
                    docs: banners
                }
            });
        } catch (error) {
            return res.status(500).json(error);
        }
        
    },
}