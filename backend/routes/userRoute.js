const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const userControllers = require("../controllers/userControllers")

router.route('/register').post(userControllers.registerUser);
router.route('/login').post(userControllers.loginUser);
router.route('/logout').get(userControllers.logoutUser);
router.route('/password/forgot').post(userControllers.forgotPassword);
router.route('/password/reset/:token').put(userControllers.resetPassword);
router.route('/me').get(isAuthenticatedUser, userControllers.getUserDetails);
router.route('/password/update').put(isAuthenticatedUser, userControllers.updatePassword);
router.route('/me/update').put(isAuthenticatedUser, userControllers.updateProfile);
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), userControllers.getAllUsers);
router.route('/admin/users/:id').get(isAuthenticatedUser, authorizeRoles('admin'), userControllers.getSingleUsers);
router.route('/admin/users/:id').put(isAuthenticatedUser, authorizeRoles('admin'), userControllers.updateUserRole);
router.route('/admin/users/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), userControllers.deleteUser);


module.exports = router;