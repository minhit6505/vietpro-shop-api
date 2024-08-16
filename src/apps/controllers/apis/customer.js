const CustomerModel = require("../../models/customers");
module.exports = {
  update: async (req, res) => {
    try {
      const {body} = req;
      const {id} = req.params;
      const isPhone = await CustomerModel.findOne({
        phone: body.phone,
        _id: {$ne: id}
      });
      if (isPhone) return res.status(400).json("phone exists");
      const customer = {
        fullName: body.fullName,
        phone: body.phone,
        address: body.address,
      };
      await CustomerModel.updateOne(
        {_id: id},
        customer,
      );
      return res.status(200).json("update customer successfully");
    } catch (error) {
      return res.status(500).json(500);
    }
  },
};
