const express = require("express")
const router = express.Router()
const productControllers = require("../controllers/productController")

router.route("/products").get(productControllers.getAllProducts);
router.route("/products/:id").get(productControllers.getProductDetails);
router.route("/products/create").post(productControllers.createProducts);
router.route("/products/:id").put(productControllers.updateProducts);
router.route("/products/:id").delete(productControllers.deleteProducts);




module.exports = router