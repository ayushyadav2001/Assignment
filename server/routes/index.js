const express = require("express");
const router = express.Router();
const authController = require("./../controller/user.controller");

router.post('/auth/register',  authController.register);
router.post("/admin/login", authController.login);

module.exports = router;
 