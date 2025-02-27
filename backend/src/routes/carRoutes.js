const express = require("express")
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages,
  uploadCarDocuments,
} = require("../controllers/carController")
const { protect, admin } = require("../middleware/auth")
const multer = require("multer")

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage })

// Public routes
router.get("/", getCars)
router.get("/:id", getCarById)

// Protected routes
router.post("/", protect, admin, createCar)
router.put("/:id", protect, admin, updateCar)
router.delete("/:id", protect, admin, deleteCar)
router.post("/:id/images", protect, admin, upload.array("images", 10), uploadCarImages)
router.post("/:id/documents", protect, admin, upload.array("documents", 5), uploadCarDocuments)

module.exports = router

console.log("Car routes created successfully with CommonJS syntax!")

