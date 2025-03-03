const mongoose = require("mongoose")

const carImageSchema = new mongoose.Schema(
  {
    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    file_path: [{
      type: String,
      required: true,
    }],
  },
  {
    timestamps: true,
  },
)

const CarImage = mongoose.model("CarImage", carImageSchema)

module.exports = CarImage

console.log("CarImage model created successfully with CommonJS syntax!")

