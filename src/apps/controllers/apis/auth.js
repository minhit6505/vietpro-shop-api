const CustomerModel = require("../../models/customers");
const jwt = require("jsonwebtoken");
const config = require("config");
const generateAccessToken = (customer) => {
  return jwt.sign({ _id: customer._id }, config.get("app.jwtAccessKey"), {
    expiresIn: "1d",
  });
};
const generateRefreshToken = (customer) => {
  return jwt.sign({ _id: customer._id }, config.get("app.jwtRefreshKey"), {
    expiresIn: "1y",
  });
};
module.exports = {
  registerCustomer: async (req, res) => {
    try {
      const { body } = req;
      const isCustomer = await CustomerModel.findOne({
        email: body.email,
      });
      if (isCustomer) return res.status(400).json("email exists");
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
  logoutCustomer: async (req, res) => {},
};
