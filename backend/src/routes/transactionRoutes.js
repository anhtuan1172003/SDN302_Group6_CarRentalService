const express = require("express")
const {
  createTransaction,
  getTransactionById,
  getMyTransactions,
  getTransactions,
  updateTransactionStatus,
  createRefundTransaction,
} = require("../controllers/transactionController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// Protected routes
router.post("/", protect, createTransaction)
router.get("/mytransactions", protect, getMyTransactions)
router.get("/:id", protect, getTransactionById)

// Admin routes
router.get("/", protect, admin, getTransactions)
router.put("/:id/status", protect, admin, updateTransactionStatus)
router.post("/:id/refund", protect, admin, createRefundTransaction)

module.exports = router

console.log("Transaction routes created successfully with CommonJS syntax!")

