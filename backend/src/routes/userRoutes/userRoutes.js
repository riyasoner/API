const express = require("express");

const router = express.Router();

const { uploads } = require("../../middlewares/multer");
const {
  signup,
  login,
  verifyOtp,
} = require("../../controllers/userController/userController");
router.post("/signup", uploads.single("profileImage"), signup);
router.post("/login", login);
router.post("/verifyOtp", verifyOtp);
module.exports = router;
