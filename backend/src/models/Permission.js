const mongoose = require("mongoose")

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    module: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    api_path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Permission = mongoose.model("Permission", permissionSchema)

module.exports = Permission

console.log("Permission model created successfully with CommonJS syntax!")

