const Car = require("../models/Car")
const Booking = require("../models/Booking")

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

// @desc    Get all cars and their booking status by owner
// @route   GET /api/cars/owner/:userId
// @access  Private
const getCarsByOwner = async (req, res) => {
  try {
    const cars = await Car.find({ user_id: req.params.userId })
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found for this owner" })
    }

    // Lấy thông tin booking cho từng xe
    const carsWithBookings = await Promise.all(cars.map(async (car) => {
      const booking = await Booking.findOne({ 
        car_id: car._id, 
        booking_status: { $ne: "completed" } 
      })
      return {
        ...car._doc,
        current_booking_status: booking ? booking.booking_status : "no active booking"
      }
    }))

    res.json(carsWithBookings)
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
    updatedData.car_approved = "no"

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

// @desc    Update booking status by car owner
// @route   PUT /api/cars/:id/status
// @access  Private
const updateCarStatus = async (req, res) => {
  try {
    const { booking_status } = req.body;
    const validStatuses = ["pending", "confirmed", "cancelled", "completed", "in process"];

    if (!validStatuses.includes(booking_status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    // Tìm xe dựa vào ID
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Kiểm tra quyền sở hữu xe
    if (car.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this car's booking status" });
    }

    // Tìm booking của xe này nhưng chưa hoàn thành
    const booking = await Booking.findOne({ 
      car_id: req.params.id, 
      booking_status: { $ne: "completed" } 
    });

    if (!booking) {
      return res.status(404).json({ message: "No active booking found for this car" });
    }

    // Cập nhật trạng thái booking
    booking.booking_status = booking_status;
    const updatedBooking = await booking.save();

    res.json({
      message: "Booking status updated successfully",
      booking: updatedBooking
    });
    
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getApprovedCars,
  getAllCars,
  getCarById,
  getCarsByOwner,
  createCar,
  updateCar,
  deleteCar,
  updateCarApproval,
  updateCarStatus
}