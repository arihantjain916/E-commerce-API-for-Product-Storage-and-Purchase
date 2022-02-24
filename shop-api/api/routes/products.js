const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');
const productController = require("../controllers/product");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const Filefilter = function (req, file, cb)  {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Please insert file in .jpeg or in .png format"),false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  Filefilter: Filefilter
});

// GET Request
router.get("/", productController.get_all_product);

//  POST Request
router.post("/",  checkAuth, upload.single("productImage"), productController.product_create_all);

// GET Request with product ID(DB)
router.get("/:productId", productController.get_product_id);

//  PATCH Request with product ID
router.patch("/:productId", checkAuth, productController.update_product_id);

//  DELETE Request with product ID
router.delete("/:productId", checkAuth, productController.delete_product_id);

module.exports = router;
