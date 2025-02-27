const mongoose = require("mongoose")

const permissionRoleSchema = new mongoose.Schema(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const PermissionRole = mongoose.model("PermissionRole", permissionRoleSchema)

module.exports = PermissionRole

console.log("PermissionRole model created successfully with CommonJS syntax!")

