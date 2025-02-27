const mongoose = require("mongoose")

const carDocumentSchema = new mongoose.Schema(
  {
    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    document_name: {
      type: String,
      required: true,
    },
    file_path: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const CarDocument = mongoose.model("CarDocument", carDocumentSchema)

module.exports = CarDocument

console.log("CarDocument model created successfully with CommonJS syntax!")

