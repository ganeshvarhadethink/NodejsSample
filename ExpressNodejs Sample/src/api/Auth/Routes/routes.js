const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/AuthController");
router.post("/login", AuthController.login);

router.post("/signup", AuthController.signUp);

router.post("/change_password", AuthController.changePassword);

router.post("/verify_email", AuthController.verifyEmail);

router.post("/send_otp", AuthController.sendOtp);

router.post("/verify_phone", AuthController.verifyPhone);

module.exports = router;
