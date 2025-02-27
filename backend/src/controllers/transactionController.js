const Transaction = require("../models/Transaction")
const Booking = require("../models/Booking")
const User = require("../models/User")

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { amount, payment_type, transaction_type, description, booking_id, recipient_id } = req.body

    // Calculate fee (e.g., 5% of amount)
    const fee = amount * 0.05
    const net_amount = amount - fee

    // Create transaction
    const transaction = new Transaction({
      amount,
      net_amount,
      fee,
      payment_type,
      transaction_type,
      description,
      booking_id: booking_id || null,
      sender_id: req.user._id,
      recipient_id: recipient_id || req.user._id,
      status: "pending",
    })

    const createdTransaction = await transaction.save()

    // If transaction is for a booking, update booking status
    if (booking_id) {
      const booking = await Booking.findById(booking_id)

      if (booking) {
        booking.booking_status = "confirmed"
        await booking.save()
      }
    }

    res.status(201).json(createdTransaction)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("sender_id", "name email")
      .populate("recipient_id", "name email")
      .populate("booking_id", "start_date_time end_date_time")

    if (transaction) {
      // Check if transaction belongs to user or user is admin
      if (
        transaction.sender_id._id.toString() !== req.user._id.toString() &&
        transaction.recipient_id._id.toString() !== req.user._id.toString() &&
        req.user.role_id !== "admin"
      ) {
        return res.status(403).json({ message: "Not authorized to access this transaction" })
      }

      res.json(transaction)
    } else {
      res.status(404).json({ message: "Transaction not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get logged in user transactions
// @route   GET /api/transactions/mytransactions
// @access  Private
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender_id: req.user._id }, { recipient_id: req.user._id }],
    })
      .populate("booking_id", "start_date_time end_date_time")
      .sort("-transaction_date")

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate("sender_id", "name email")
      .populate("recipient_id", "name email")
      .populate("booking_id", "start_date_time end_date_time")
      .sort("-transaction_date")

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update transaction status
// @route   PUT /api/transactions/:id/status
// @access  Private/Admin
const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!["pending", "completed", "failed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const transaction = await Transaction.findById(req.params.id)

    if (transaction) {
      transaction.status = status

      // If transaction is completed, update user wallet
      if (status === "completed") {
        if (transaction.transaction_type === "payment" || transaction.transaction_type === "deposit") {
          const recipient = await User.findById(transaction.recipient_id)

          if (recipient) {
            recipient.wallet += transaction.net_amount
            await recipient.save()
          }
        } else if (transaction.transaction_type === "withdrawal") {
          const sender = await User.findById(transaction.sender_id)

          if (sender) {
            sender.wallet -= transaction.amount
            await sender.save()
          }
        }
      }

      const updatedTransaction = await transaction.save()
      res.json(updatedTransaction)
    } else {
      res.status(404).json({ message: "Transaction not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create refund transaction
// @route   POST /api/transactions/:id/refund
// @access  Private/Admin
const createRefundTransaction = async (req, res) => {
  try {
    const originalTransaction = await Transaction.findById(req.params.id)

    if (!originalTransaction) {
      return res.status(404).json({ message: "Original transaction not found" })
    }

    if (originalTransaction.status !== "completed") {
      return res.status(400).json({ message: "Can only refund completed transactions" })
    }

    // Create refund transaction
    const refundTransaction = new Transaction({
      amount: originalTransaction.amount,
      net_amount: originalTransaction.net_amount,
      fee: 0, // No fee for refunds
      payment_type: originalTransaction.payment_type,
      transaction_type: "refund",
      description: `Refund for transaction ${originalTransaction._id}`,
      booking_id: originalTransaction.booking_id,
      sender_id: originalTransaction.recipient_id,
      recipient_id: originalTransaction.sender_id,
      refund_transaction_id: originalTransaction._id,
      status: "pending",
    })

    const createdRefund = await refundTransaction.save()

    res.status(201).json(createdRefund)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  createTransaction,
  getTransactionById,
  getMyTransactions,
  getTransactions,
  updateTransactionStatus,
  createRefundTransaction,
}

console.log("Transaction controller created successfully with CommonJS syntax!")

