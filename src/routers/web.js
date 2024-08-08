const express = require("express");
const router = express.Router();
const CategoryController = require("../apps/controllers/apis/category");
const ProductController = require("../apps/controllers/apis/product");
const OrderController = require("../apps/controllers/apis/order");
const SliderController = require("../apps/controllers/apis/slider");
const BannerController = require("../apps/controllers/apis/banner");
const CustomerConrtoller = require("../apps/controllers/apis/customer");
const AuthController = require("../apps/controllers/apis/auth");

router.get("/categories", CategoryController.index);
router.get("/categories/:id", CategoryController.show);
router.get("/categories/:id/products", CategoryController.productsCategory);
router.get("/products", ProductController.index);
router.get("/products/:id", ProductController.show);
router.get("/products/:id/comments", ProductController.comments);
router.post("/products/:id/comments", ProductController.storeComments);
router.post("/order", OrderController.order);
router.get("/sliders", SliderController.index);
router.get("/banners", BannerController.index);
router.post("/customers/register", AuthController.registerCustomer);
router.post("/customers/login", AuthController.loginCustomer);
router.get("/customers/:id/orders", OrderController.index);
router.get("/customer/orders/:id/canceled", OrderController.canceled);

module.exports = router;