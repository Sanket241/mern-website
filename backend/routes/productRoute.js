const express = require("express")
const router = express.Router()
const productControllers = require("../controllers/productController")
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth")

router.route("/products").get(isAuthenticatedUser, authorizeRoles("admin"),  productControllers.getAllProducts);
router.route("/products/:id").get(productControllers.getProductDetails);
router.route("/admin/products/create").post(isAuthenticatedUser, authorizeRoles("admin"), productControllers.createProducts);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), productControllers.updateProducts);
router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), productControllers.deleteProducts);
router.route("/review").put(isAuthenticatedUser, productControllers.createProductReview);
router.route("/reviews").get(productControllers.getProductReviews);
router.route("/reviews").delete(isAuthenticatedUser, productControllers.deleteReview);





module.exports = router
// 