const express = require("express");
const router = express.Router();
const authController = require("./../controller/user.controller");
const authenticateAndAuthorize = require("../utils/protectedRouted");

router.get("/user/getProfile",authenticateAndAuthorize, authController.getProfileData);
 

module.exports = router;
