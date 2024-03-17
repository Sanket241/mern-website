const express = require("express")
const router = express.Router()
const productControllers = require("../controllers/productController")
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth")

router.route("/products").get(isAuthenticatedUser, authorizeRoles("admin"),  productControllers.getAllProducts);
router.route("/products/:id").get(productControllers.getProductDetails);
router.route("/admin/products/create").post(isAuthenticatedUser, productControllers.createProducts);
router.route("/admin/products/:id").put(isAuthenticatedUser, productControllers.updateProducts);
router.route("/admin/products/:id").delete(isAuthenticatedUser, productControllers.deleteProducts);




module.exports = router
// 