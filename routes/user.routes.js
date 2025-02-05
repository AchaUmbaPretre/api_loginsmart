const express = require("express");
const router = express.Router();
const  userController = require('./../controllers/user.controller');

router.get('/', userController.getUsers)
router.get('/one', userController.getUserOne)
router.post('/', userController.registerUser)
router.put('/', userController.putUser)

module.exports = router;