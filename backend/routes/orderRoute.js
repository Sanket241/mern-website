const express = require('express')
const router = express.Router()
const orderRouter = require('../controllers/orderControllers')
const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')

router.route('/order/new').post(isAuthenticatedUser,orderRouter.newOrder)
router.route('/order/:id').get(isAuthenticatedUser, orderRouter.getSingleOrder)
router.route('/orders/me').get(isAuthenticatedUser,orderRouter.myorders)
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"),orderRouter.getAllorders)
router.route('/admin/orders/:id').put(isAuthenticatedUser, authorizeRoles("admin"), orderRouter.updateOrder)
router.route('/admin/orders/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), orderRouter.deleteOrder)







module.exports = router