const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (file.fieldname === "profileImage") {
      uploadPath = path.join(__dirname, "../../public/profileImage");
    } else if (file.fieldname === "productImage") {
      uploadPath = path.join(__dirname, "../../public/productImage");
    } else if (file.fieldname.startsWith("variantImage")) {
      uploadPath = path.join(__dirname, "../../public/variantImage");
    } else {
      return cb(new Error("Invalid fieldname"));
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploads };
