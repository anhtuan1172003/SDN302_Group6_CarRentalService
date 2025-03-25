const User = require("../models/User");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user
// @route   POST /users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Generate tokens
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to user
      user.refresh_token = refreshToken;
      await user.save();

      // Populate role_id with error handling
      const populatedUser = await User.findById(user._id)
        .populate({ path: "role_id", select: "name description" })
        .select("-password -refresh_token");

      res.status(201).json({
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role_id: populatedUser.role_id || null,
        token,
        refreshToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error while registering user" });
  }
};

// @desc    Auth user & get token
// @route   POST /users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and populate role_id
    const user = await User.findOne({ email }).populate({
      path: "role_id",
      select: "name description",
    });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate tokens
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to user
      user.refresh_token = refreshToken;
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role_id: user.role_id || null,
        token,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error while logging in" });
  }
};

// @desc    Get user profile
// @route   GET /users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: "role_id", select: "name description" })
      .select("-password -refresh_token");

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role_id: user.role_id || null,
        address: user.address,
        phone_no: user.phone_no,
        date_of_birth: user.date_of_birth,
        driving_license: user.driving_license,
        national_id_no: user.national_id_no,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// @desc    Update user profile (không bao gồm password)
// @route   PUT /users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.phone_no = req.body.phone_no || user.phone_no;
      user.date_of_birth = req.body.date_of_birth || user.date_of_birth;
      user.driving_license = req.body.driving_license || user.driving_license;
      user.national_id_no = req.body.national_id_no || user.national_id_no;

      const updatedUser = await user.save();

      const populatedUser = await User.findById(updatedUser._id)
        .populate({ path: "role_id", select: "name description" })
        .select("-password -refresh_token");

      res.json({
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        address: populatedUser.address,
        phone_no: populatedUser.phone_no,
        date_of_birth: populatedUser.date_of_birth,
        driving_license: populatedUser.driving_license,
        national_id_no: populatedUser.national_id_no,
        role_id: populatedUser.role_id || null,
        token: generateToken(populatedUser._id),
        refreshToken: updatedUser.refresh_token,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// @desc    Change user password
// @route   PUT /users/change-password
// @access  Private
const changeUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required" });
    }
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changeUserPassword:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

// @desc    Refresh token
// @route   POST /users/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const user = await User.findOne({ refresh_token: refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateToken(user._id);
        res.json({ token: newAccessToken });
      }
    );
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(500).json({ message: "Server error while refreshing token" });
  }
};

// @desc    Logout user / clear refresh token
// @route   POST /users/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.refresh_token = null;
      await user.save();
      res.json({ message: "Logged out successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: "Server error while logging out" });
  }
};

// @desc    Get all users
// @route   GET /users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    // Lấy các tham số từ query
    const { page = 1, limit } = req.query;

    let users;
    let totalUsers;

    // Đếm tổng số người dùng
    totalUsers = await User.countDocuments({});

    if (limit) {
      // Tính toán skip và limit cho phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy người dùng với phân trang
      users = await User.find({})
        .populate({ path: "role_id", select: "name description" })
        .select("-password -refresh_token")
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      // Lấy tất cả người dùng nếu không có limit
      users = await User.find({})
        .populate({ path: "role_id", select: "name description" })
        .select("-password -refresh_token");
    }

    res.json({
      users: users,
      totalUsers,
      currentPage: parseInt(page),
      totalPages: limit ? Math.ceil(totalUsers / parseInt(limit)) : 1,
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// @desc    Delete user account
// @route   DELETE /users/deleteaccount (self) or /users/:id (admin)
// @access  Private (self) or Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ngăn admin tự xóa chính mình
    if (req.user && req.user._id.toString() === userId.toString()) {
      const role = user.role_id
        ? await Role.findById(user.role_id)
        : { name: "user" };
      if (role && role.name === "admin") {
        return res
          .status(403)
          .json({ message: "Admin cannot delete their own account" });
      }
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({ path: "role_id", select: "name description" })
      .select("-password -refresh_token");

    if (user) {
      // Lấy danh sách xe mà người dùng đã đăng
      const cars = await Car.find({ user_id: user._id }); // Sửa 'owner' thành 'user_id' để khớp với schema

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role_id: user.role_id || null,
        address: user.address,
        phone_no: user.phone_no,
        dategins_of_birth: user.date_of_birth,
        driving_license: user.driving_license,
        national_id_no: user.national_id_no,
        cars, // Danh sách xe
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ message: "Server error while fetching user" });
  }
};

// @desc    Update user (admin only)
// @route   PUT /users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // Ngăn admin tự thay đổi role_id của chính mình
      if (
        req.user &&
        req.user._id.toString() === req.params.id &&
        req.body.role_id &&
        req.body.role_id !== user.role_id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Admin cannot change their own role" });
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role_id = req.body.role_id || user.role_id;

      const updatedUser = await user.save();
      const populatedUser = await User.findById(updatedUser._id)
        .populate({ path: "role_id", select: "name description" })
        .select("-password -refresh_token");

      res.json({
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role_id: populatedUser.role_id || null,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Server error while updating user" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  refreshToken,
  logoutUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};