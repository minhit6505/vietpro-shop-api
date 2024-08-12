const mongoose = require("../../common/database")();
const orderSchema = new mongoose.Schema({
    customer_id:{
        type: mongoose.Types.ObjectId,
        required: true,
    },
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
    status:{
        type: Number,
        default: 1,
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
}, {timestamps: true});
const OrderModel = mongoose.model("Orders", orderSchema, "orders");
module.exports = OrderModel;