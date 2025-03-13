const mongoose = require("mongoose")

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    base_price: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    car_status: {
      type: String,
      enum: ["available", "maintenance", "unavailable"],
      default: "available",
    },
    car_approved: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    color: {
      type: String,
      required: true,
    },
    license_plate: {
      type: String,
      required: true,
      unique: true,
    },
    production_years: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    fuel_consumption: {
      type: Number,
      required: true,
    },
    fuel_type: {
      type: String,
      required: true,
    },
    transmission_type: {
      type: String,
      required: true,
    },
    number_of_seats: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    terms_of_use: {
      type: String,
      required: true,
    },
    additional_functions: {
      type: String,
    },
    image_url: [{
      type: String,
      required: true,
    }],
    document_url: [{
      type: String,
      required: true,
    }],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Car = mongoose.model("Car", carSchema)
module.exports = Car

console.log("Car model created successfully with CommonJS syntax!")