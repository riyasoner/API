const express = require("express");
const router = express.Router();
// const userRoutes = require("./userRoutes/userRoutes");
const productRoutes = require("./productRoutes/productRoutes");

// router.use("/", userRoutes);
router.use("/", productRoutes);
module.exports = router;
