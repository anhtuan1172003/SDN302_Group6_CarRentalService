const Car = require("../models/Car")
const CarImage = require("../models/CarImage")
const CarDocument = require("../models/CarDocument")

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const cars = await Car.find({})
    res.json(cars)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (car) {
      // Get car images
      const carImages = await CarImage.find({ car_id: car._id })

      // Get car documents
      const carDocuments = await CarDocument.find({ car_id: car._id })

      res.json({
        ...car._doc,
        images: carImages,
        documents: carDocuments,
      })
    } else {
      res.status(404).json({ message: "Car not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const car = new Car({
      ...req.body,
      user_id: req.user._id, // Assuming user ID is available from auth middleware
    })

    const createdCar = await car.save()
    res.status(201).json(createdCar)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (car) {
      Object.keys(req.body).forEach((key) => {
        car[key] = req.body[key]
      })

      const updatedCar = await car.save()
      res.json(updatedCar)
    } else {
      res.status(404).json({ message: "Car not found" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (car) {
      await car.deleteOne()

      // Delete related images
      await CarImage.deleteMany({ car_id: car._id })

      // Delete related documents
      await CarDocument.deleteMany({ car_id: car._id })

      res.json({ message: "Car removed" })
    } else {
      res.status(404).json({ message: "Car not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Upload car images
// @route   POST /api/cars/:id/images
// @access  Private/Admin
const uploadCarImages = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" })
    }

    const uploadedImages = []

    for (const file of req.files) {
      const carImage = new CarImage({
        car_id: car._id,
        file_path: file.path,
      })

      const savedImage = await carImage.save()
      uploadedImages.push(savedImage)
    }

    res.status(201).json(uploadedImages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Upload car documents
// @route   POST /api/cars/:id/documents
// @access  Private/Admin
const uploadCarDocuments = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" })
    }

    const uploadedDocuments = []

    for (const file of req.files) {
      const carDocument = new CarDocument({
        car_id: car._id,
        document_name: req.body.document_name || file.originalname,
        file_path: file.path,
        file_type: file.mimetype,
      })

      const savedDocument = await carDocument.save()
      uploadedDocuments.push(savedDocument)
    }

    res.status(201).json(uploadedDocuments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages,
  uploadCarDocuments,
}

console.log("Car controller created successfully with CommonJS syntax!")

