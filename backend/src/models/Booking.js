const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    renter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    start_date_time: {
      type: Date,
      required: true,
    },
    end_date_time: {
      type: Date,
      required: true,
    },
    booking_status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    total_amount: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    drivers_information: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking

console.log("Booking model created successfully with CommonJS syntax!")

