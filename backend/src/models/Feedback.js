const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Feedback = mongoose.model("Feedback", feedbackSchema)

module.exports = Feedback

console.log("Feedback model created successfully with CommonJS syntax!")

