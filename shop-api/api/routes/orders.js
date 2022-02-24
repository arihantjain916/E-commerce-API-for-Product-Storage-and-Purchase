const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/orders");

// GET Request
router.get("/", checkAuth, OrdersController.orders_get_all);

//  POST Request
router.post("/", checkAuth, OrdersController.orders_create_all);

// GET Request with order ID
router.get("/:orderId", checkAuth, OrdersController.orders_get_id);

//  DELETE Request with order ID
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_id);

module.exports = router;
