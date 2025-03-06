const Booking = require("../models/Booking")
const Car = require("../models/Car")

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { car_id, start_date_time, end_date_time, payment_method, drivers_information } = req.body

    // Check if car exists
    const car = await Car.findById(car_id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    // Check if car is available
    if (car.car_status !== "available") {
      return res.status(400).json({ message: "Car is not available for booking" })
    }

    // Calculate booking duration in days
    const startDate = new Date(start_date_time)
    const endDate = new Date(end_date_time)
    const durationInMs = endDate - startDate
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24))

    if (durationInDays <= 0) {
      return res.status(400).json({ message: "Invalid booking duration" })
    }

    // Calculate total amount
    const total_amount = car.base_price * durationInDays

    // Create booking
    const booking = new Booking({
      car_id,
      user_id: req.user._id,
      start_date_time,
      end_date_time,
      total_amount,
      deposit: car.deposit,
      payment_method,
      drivers_information: req.user.name || "",
    })

    const createdBooking = await booking.save()

    // Update car status
    // car.car_status = "booked"
    // await car.save()

    res.status(201).json(createdBooking)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car_id", "brand model name license_plate")
      .populate("user_id", "name email phone_no")

    if (booking) {
      // Check if booking belongs to user or user is admin
      if (booking.user_id._id.toString() !== req.user._id.toString() && req.user.role_id !== "admin") {
        return res.status(403).json({ message: "Not authorized to access this booking" })
      }

      res.json(booking)
    } else {
      res.status(404).json({ message: "Booking not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user._id })
      .populate("car_id", "brand model name license_plate")
      .sort("-createdAt")

    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("car_id", "brand model name license_plate")
      .populate("user_id", "name email")
      .sort("-createdAt")

    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const booking = await Booking.findById(req.params.id)

    if (booking) {
      booking.booking_status = status

      // If booking is cancelled or completed, make car available again
      if (status === "cancelled" || status === "completed") {
        const car = await Car.findById(booking.car_id)
        if (car) {
          car.car_status = "available"
          await car.save()
        }
      }

      const updatedBooking = await booking.save()
      res.json(updatedBooking)
    } else {
      res.status(404).json({ message: "Booking not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (booking) {
      // Make car available again
      const car = await Car.findById(booking.car_id)
      if (car) {
        car.car_status = "available"
        await car.save()
      }

      await booking.deleteOne()
      res.json({ message: "Booking removed" })
    } else {
      res.status(404).json({ message: "Booking not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createBooking,
  getBookingById,
  getMyBookings,
  getBookings,
  updateBookingStatus,
  deleteBooking,
}

console.log("Booking controller created successfully with CommonJS syntax!")

