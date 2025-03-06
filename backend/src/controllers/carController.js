const Car = require("../models/Car")

// @desc    Get all approved cars
// @route   GET /api/cars
// @access  Public
const getApprovedCars = async (req, res) => {
  try {
    const cars = await Car.find({ car_approved: "yes" })
    res.json(cars)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all cars (including unapproved)
// @route   GET /api/cars/admin
// @access  Private/Admin
const getAllCars = async (req, res) => {
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
      res.json(car)
    } else {
      res.status(404).json({ message: "Car not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all cars by owner (user)
// @route   GET /api/cars/owner/:userId
// @access  Private
const getCarsByOwner = async (req, res) => {
  try {
    const cars = await Car.find({ user_id: req.params.userId })
    if (cars.length > 0) {
      res.json(cars)
    } else {
      res.status(404).json({ message: "No cars found for this owner" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a car
// @route   POST /api/cars
// @access  Private
const createCar = async (req, res) => {
  try {
    const carData = req.body

    // Assuming file upload is handled by middleware and URLs are passed in the request body
    const car = new Car({
      ...carData,
      user_id: req.user._id,
      car_approved: "no",
    })

    const createdCar = await car.save()
    res.status(201).json(createdCar)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    if (car.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this car" })
    }

    const updatedData = req.body

    // Always set car_approved to "no" when updating
    updatedData.car_approved = "no"

    // Update car fields
    Object.keys(updatedData).forEach((key) => {
      car[key] = updatedData[key]
    })

    const updatedCar = await car.save()
    res.json(updatedCar)
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
      res.json({ message: "Car removed" })
    } else {
      res.status(404).json({ message: "Car not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update car approval status
// @route   PUT /api/cars/:id/approve
// @access  Private/Admin
const updateCarApproval = async (req, res) => {
  try {
    const { car_approved } = req.body

    if (!["yes", "no"].includes(car_approved)) {
      return res.status(400).json({ message: "Invalid approval status" })
    }

    const car = await Car.findById(req.params.id)

    if (car) {
      car.car_approved = car_approved

      const updatedCar = await car.save()
      res.json(updatedCar)
    } else {
      res.status(404).json({ message: "Car not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getApprovedCars,
  getAllCars,
  getCarById,
  getCarsByOwner,
  createCar,
  updateCar,
  deleteCar,
  updateCarApproval,
}
