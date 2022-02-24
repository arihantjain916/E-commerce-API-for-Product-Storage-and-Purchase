const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name price")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        products: docs.map((doc) => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/api/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  return;
};

exports.orders_create_all = (req, res, next) => {
  const id = req.body.productID;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not Found",
        });
      }
      const order = new Order({
        message: "Orders were created",
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      return res.status(201).json({
        message: "Order Created Successfully",
        createdorder: {
          productId: result.product,
          quantity: result.quantity,
          id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/api/orders/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
  return;
};

exports.orders_get_id = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        res.status(404).json({
          message: "order Not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/api/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_delete_id = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted Successfully",
        request: {
          type: "POST",
          url: "http://localhost:3000/api/orders/",
          body: {
            productID: "String",
            quantity: "Number",
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