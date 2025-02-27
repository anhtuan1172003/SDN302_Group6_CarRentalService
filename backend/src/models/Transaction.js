const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    net_amount: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    payment_type: {
      type: String,
      required: true,
    },
    payment_reference_id: {
      type: String,
    },
    transaction_type: {
      type: String,
      enum: ["payment", "refund", "deposit", "withdrawal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    description: {
      type: String,
    },
    failure_reason: {
      type: String,
    },
    ip_address: {
      type: String,
    },
    secure_hash: {
      type: String,
    },
    locale: {
      type: String,
      default: "en",
    },
    is_test: {
      type: Boolean,
      default: false,
    },
    transaction_date: {
      type: Date,
      default: Date.now,
    },
    transaction_id: {
      type: String,
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    refund_transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    return_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = Transaction

console.log("Transaction model created successfully with CommonJS syntax!")

