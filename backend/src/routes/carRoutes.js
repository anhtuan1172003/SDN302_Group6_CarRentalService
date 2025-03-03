const express = require("express")
const {
  getApprovedCars,
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages,
  uploadCarDocuments,
} = require("../controllers/carController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// Public routes
router.get("/", getApprovedCars)

// Admin routes
router.get("/admin", protect, admin, getAllCars)
router.post("/", protect, createCar)

// Route 
router.get("/:id", getCarById)
router.put("/:id", protect, updateCar)
router.delete("/:id", protect, admin, deleteCar)
router.post("/:id/images", protect, uploadCarImages)
router.post("/:id/documents", protect, uploadCarDocuments)

module.exports = router

console.log("Car routes created successfully with CommonJS syntax!")

