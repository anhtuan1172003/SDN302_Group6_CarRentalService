const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const Role = mongoose.model("Role", roleSchema)

module.exports = Role

console.log("Role model created successfully with CommonJS syntax!")

