const OrderModel = require("../../models/order");
const ProductModel = require("../../models/product");
const transporter = require("../../../libs/mail");
const _ = require("lodash");
const ejs = require("ejs");
const path = require("path");
module.exports = {
  index: async (req, res)=>{
    try {
        const {id} = req.params;
        const ordersByCustomerId = await OrderModel.find({customer_id: id})
        .sort({_id: -1});
        return res.status(200).json({
            status: "success",
            data: {
                docs: ordersByCustomerId,
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
  },
  order: async (req, res) => {
    const body = req.body;
    let totalPrice = 0;
    totalPrice = body.items.reduce(
      (total, item) => total + item.qty * item.price,
      0
    );
    const order = {
      customer_id: body.customer_id,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      totalPrice,
      items: body.items,
    };
    await OrderModel(order).save();

    const idsPrd = body.items.map((item) => item.prd_id);
    const products = await ProductModel.find({ _id: { $in: idsPrd } }).lean();
    let items = [];
    for (let prd of products) {
      const cart = _.find(body.items, {
        prd_id: prd._id.toString(),
      });
      if (cart) {
        cart.name = prd.name;
        items.push(cart);
      }
    }
    // console.log(items);

    const html = await ejs.renderFile(
      path.join(req.app.get("views"), "mail.ejs"),
      {
        fullName: body.fullName,
        phone: body.phone,
        address: body.address,
        totalPrice,
        items,
      }
    );
    await transporter.sendMail({
      from: '"Vietpro Shop" <quantri.vietproshop@gmail.com>',
      to: `quantri.vietproshop@gmail.com, ${body.email}`,
      subject: "Xác nhận đơn hàng từ Vietpro Store",
      html,
    });

    res.status(201).json({
      status: "success",
      message: "Create order successfully",
    });
  },
  show: async (req, res)=>{
    try {
      const {id} = req.params;
      const order = await OrderModel.findById(id);
      return res.status(200).json({
        status: "success",
        data: order,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }, 
  canceled: async (req, res)=>{
    try {
      const {id} = req.params;
      await OrderModel.updateOne(
        {_id: id},
        {status: 0}
      );
      return res.status(200).json("Canceled order successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  }

};
