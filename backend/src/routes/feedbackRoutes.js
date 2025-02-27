const express = require("express")
const {
  createFeedback,
  getFeedbacks,
  getFeedbacksByCarId,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// Public routes
router.get("/", getFeedbacks)
router.get("/car/:carId", getFeedbacksByCarId)
router.get("/:id", getFeedbackById)

// Protected routes
router.post("/", protect, createFeedback)
router.put("/:id", protect, updateFeedback)

// Admin routes
router.delete("/:id", protect, admin, deleteFeedback)

module.exports = router

console.log("Feedback routes created successfully with CommonJS syntax!")

