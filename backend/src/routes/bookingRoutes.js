const express = require("express")
const {
  createBooking,
  getBookingById,
  getMyBookings,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// Protected routes
router.post("/", protect, createBooking)
router.get("/mybookings", protect, getMyBookings)
router.get("/:id", protect, getBookingById)

// Admin routes
router.get("/", protect, admin, getBookings)
router.put("/:id/status", protect, admin, updateBookingStatus)
router.delete("/:id", protect, admin, deleteBooking)

module.exports = router

console.log("Booking routes created successfully with CommonJS syntax!")

