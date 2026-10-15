// routes/order.js
const express = require('express');
const router = express.Router();
const { verifyToken } =require("../middleware/auth-middleware")
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
} = require('../handlers/order-handler');

// All routes require authentication
router.use(verifyToken);

// Cart routes
router.get('/cart', getCart);
router.post('/cart/add', addToCart);
router.put('/cart/update/:productId', updateCartItem);
router.delete('/cart/remove/:productId', removeFromCart);

// Order routes
router.post('/order/place', placeOrder);
router.get('/orders', getUserOrders);
router.get('/order/:orderId', getOrderById);
router.put('/order/:orderId/cancel', cancelOrder);

module.exports = router;        