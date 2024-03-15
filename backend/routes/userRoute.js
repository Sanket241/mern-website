const express = require('express');
const router = express.Router();

const userControllers = require("../controllers/userControllers")

router.route('/register').post(userControllers.registerUser);
router.route('/login').post(userControllers.loginUser);
router.route('/logout').get(userControllers.logoutUser);


module.exports = router;