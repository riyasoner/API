const express = require("express");

const router = express.Router();

const { uploads } = require("../../middlewares/multer");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  softDeleteProduct,
} = require("../../controllers/productsController/productController");
router.post("/createProduct", uploads.any(), createProduct);
router.get("/getAllProducts", getAllProducts);
// router.get("/getProductById/:id", getProductById);
router.patch("/updateProduct/:id", uploads.any(), updateProduct);
router.delete("/softDeleteProduct/:id", softDeleteProduct);

module.exports = router;
