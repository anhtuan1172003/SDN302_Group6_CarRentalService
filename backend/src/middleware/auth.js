const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Role = require("../models/Role")
const PermissionRole = require("../models/PermissionRole")
const Permission = require("../models/Permission")

// Protect routes
const protect = async (req, res, next) => {
  let token

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password")

      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: "Not authorized, token failed" })
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" })
  }
}

// Admin middleware
const admin = async (req, res, next) => {
  try {
    if (!req.user.role_id) {
      return res.status(403).json({ message: "Not authorized as admin" })
    }

    const role = await Role.findById(req.user.role_id)

    if (!role || role.name !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" })
    }

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.error(error);
      // Không trả về lỗi, chỉ không set req.user
    }
  }

  next();
};

// Check permission middleware
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user.role_id) {
        return res.status(403).json({ message: "Not authorized" })
      }

      // Get permission ID
      const permission = await Permission.findOne({ name: requiredPermission })

      if (!permission) {
        return res.status(403).json({ message: "Permission not found" })
      }

      // Check if role has permission
      const permissionRole = await PermissionRole.findOne({
        role_id: req.user.role_id,
        permission_id: permission._id,
      })

      if (!permissionRole) {
        return res.status(403).json({ message: "Not authorized for this action" })
      }

      next()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  }
}

module.exports = { protect, admin, checkPermission, optionalAuth }

console.log("Auth middleware created successfully with CommonJS syntax!")

