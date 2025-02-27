const Feedback = require("../models/Feedback")
const Booking = require("../models/Booking")

// @desc    Create new feedback
// @route   POST /api/feedbacks
// @access  Private
const createFeedback = async (req, res) => {
  try {
    const { booking_id, content, rating } = req.body

    // Check if booking exists
    const booking = await Booking.findById(booking_id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to create feedback for this booking" })
    }

    // Check if booking is completed
    if (booking.booking_status !== "completed") {
      return res.status(400).json({ message: "Can only create feedback for completed bookings" })
    }

    // Check if feedback already exists for this booking
    const existingFeedback = await Feedback.findOne({ booking_id })

    if (existingFeedback) {
      return res.status(400).json({ message: "Feedback already exists for this booking" })
    }

    // Create feedback
    const feedback = new Feedback({
      booking_id,
      content,
      rating,
    })

    const createdFeedback = await feedback.save()
    res.status(201).json(createdFeedback)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Public
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate({
        path: "booking_id",
        populate: {
          path: "car_id",
          select: "brand model name",
        },
      })
      .sort("-date")

    res.json(feedbacks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get feedbacks by car ID
// @route   GET /api/feedbacks/car/:carId
// @access  Public
const getFeedbacksByCarId = async (req, res) => {
  try {
    const bookings = await Booking.find({ car_id: req.params.carId })
    const bookingIds = bookings.map((booking) => booking._id)

    const feedbacks = await Feedback.find({ booking_id: { $in: bookingIds } })
      .populate("booking_id", "user_id start_date_time end_date_time")
      .sort("-date")

    res.json(feedbacks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get feedback by ID
// @route   GET /api/feedbacks/:id
// @access  Public
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate({
      path: "booking_id",
      populate: {
        path: "car_id user_id",
        select: "brand model name email",
      },
    })

    if (feedback) {
      res.json(feedback)
    } else {
      res.status(404).json({ message: "Feedback not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update feedback
// @route   PUT /api/feedbacks/:id
// @access  Private
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    const booking = await Booking.findById(feedback.booking_id)

    // Check if booking belongs to user
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this feedback" })
    }

    feedback.content = req.body.content || feedback.content
    feedback.rating = req.body.rating || feedback.rating

    const updatedFeedback = await feedback.save()
    res.json(updatedFeedback)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete feedback
// @route   DELETE /api/feedbacks/:id
// @access  Private/Admin
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)

    if (feedback) {
      await feedback.deleteOne()
      res.json({ message: "Feedback removed" })
    } else {
      res.status(404).json({ message: "Feedback not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedbacksByCarId,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
}

console.log("Feedback controller created successfully with CommonJS syntax!")

