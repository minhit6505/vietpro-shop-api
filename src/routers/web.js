const express = require("express");
const config = require("config");
const router = express.Router();
const CategoryController = require("../apps/controllers/apis/category");
const ProductController = require("../apps/controllers/apis/product");
const OrderController = require("../apps/controllers/apis/order");
const SliderController = require("../apps/controllers/apis/slider");
const BannerController = require("../apps/controllers/apis/banner");
const CustomerConrtoller = require("../apps/controllers/apis/customer");
const AuthController = require("../apps/controllers/apis/auth");
const AuthMiddleware = require("../apps/middlewares/auth");

// Use/Dont use Auth for Router
const useAuth = config.get("app.useAuthMiddleware")
    ? AuthMiddleware.verifyAuthenticationCustomer
    : (req, res, next)=>next();

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
router.post("/customers/:id/update", useAuth, CustomerConrtoller.update);
router.post("/customers/login", AuthController.loginCustomer);
router.get("/customers/:id/logout", useAuth, AuthController.logoutCustomer);
router.get("/customer/refreshtoken", useAuth, AuthController.refreshToken);
router.get("/customers/:id/orders", useAuth, OrderController.index);
router.get("/customer/orders/:id", useAuth, OrderController.show);
router.get("/customer/orders/:id/canceled", useAuth, OrderController.canceled);
router.get("/test/authentication",
    useAuth, 
    (req, res)=>{
        return res.status(200).json("You have access");
    }
);
router.get("/test/headers", (req, res)=>{

    console.log(req.headers);
    
});

module.exports = router;