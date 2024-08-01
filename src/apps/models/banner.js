const mongoose = require("../../common/database")();
const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    url:{
        type: String,
        required: true,
    },
    target:{
        type: Boolean,
        default: true,
    },
    position:{
        type: Number,
        default: 1,
    },
    publish:{
        type: Boolean,
        default: true,
    },
}, {timestamps: true});
const BannerModel = mongoose.model("Banners", bannerSchema, "banners");
module.exports = BannerModel;