const mongoose = require("../../common/database")();
const orderSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0,
    },
    items:[
        {
            prd_id:{
                type: String,
                required: true,
            },
            qty:{
                type: Number,
                required: true,
            },
            price:{
                type: Number,
                required: true,
            },
        }
    ],
});
const OrderModel = mongoose.model("Orders", orderSchema, "orders");
module.exports = OrderModel;