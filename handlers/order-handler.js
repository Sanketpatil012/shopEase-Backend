// handlers/order-handler.js
const Order = require("../db/order");
const Cart = require("../db/carts");
const Product = require("../db/product");

// Get current cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      if (item.product) {
        const finalPrice = item.product.price - (item.product.discount || 0);
        totalAmount += finalPrice * item.quantity;
      }
    }

    res.json({
      success: true,
      cart: {
        items: cart.items,
        totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate product details for response
    await cart.populate("items.product");

    // Calculate total
    let totalAmount = 0;
    for (const item of cart.items) {
      const finalPrice = item.product.price - (item.product.discount || 0);
      totalAmount += finalPrice * item.quantity;
    }

    res.json({
      success: true,
      message: "Item added to cart",
      cart: {
        items: cart.items,
        totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");

    // Calculate total
    let totalAmount = 0;
    for (const item of cart.items) {
      const finalPrice = item.product.price - (item.product.discount || 0);
      totalAmount += finalPrice * item.quantity;
    }

    res.json({
      success: true,
      message: "Cart updated",
      cart: {
        items: cart.items,
        totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Place order
const placeOrder = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;
      const finalPrice = product.price - (product.discount || 0);
      const itemTotal = finalPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        productSnapshot: {
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          image: product.image,
          shortDescription: product.shortDescription,
        },
        quantity: item.quantity,
        priceAtTime: finalPrice,
      });
    }

    // Generate unique order ID
    const orderId =
      "ORD-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 6).toUpperCase();

    // Create order
    const order = new Order({
      orderId,
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      shippingAddress: paymentMethod !== "cod" ? shippingAddress : undefined,
      notes,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    // Populate order details
    await order.populate("user", "name email phone");

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalOrders: total,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single order details
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, user: req.user.id });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, user: req.user.id });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "cancelled";
    order.cancelledAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
};
