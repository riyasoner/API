const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    let folder = "";

    if (file.fieldname === "profileImage") folder = "profileImage/";
    else if (file.fieldname === "productImage") folder = "productImage/";
    else if (file.fieldname.startsWith("variantImage"))
      folder = "variantImage/";
    else return cb(new Error("Invalid fieldname"));

    const fileName = `${folder}${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const uploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploads };
