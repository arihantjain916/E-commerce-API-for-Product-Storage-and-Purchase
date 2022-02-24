const Product = require("../models/product");

exports.get_all_product = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            id: doc._id,
            ProductImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/api/products/" + doc._id,
            },
          };
        }),
      };
      // if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: "Empty Data",
      //   });
      // }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.product_create_all = (req, res, next) => {
  // Put data into database
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log();
      res.status(201).json({
        message: "Product Created Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/api/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_product_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(404).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/api/products/" + doc._id,
          },
        });
      } else {
        res.status(200).json({
          message: "No Valid Entry Found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.update_product_id = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propname] = ops.value;
  }
  Product.findOneAndUpdate({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/api/products/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_product_id = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Data deleted Successfully",
        request: {
          type: "POST",
          url: "http://localhost:3000/api/products/",
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
