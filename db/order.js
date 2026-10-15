const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  productSnapshot: {
    name: String,
    price: Number,
    discount: Number,
    image: [String],
    shortDescription: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtTime: {
    type: Number,
    required: true,
  },
});
const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi", "netbanking"],
      default: "cod",
    },
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: Date,
    cancelledAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ user: 1, orderDate: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
