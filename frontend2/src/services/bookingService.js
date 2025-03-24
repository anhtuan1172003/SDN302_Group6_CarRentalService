import axios from "axios"

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post("/bookings", bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    return response.data
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

// Get user's bookings
export const getUserBookings = async () => {
  try {
    const response = await axios.get("/bookings/mybookings")
    return response.data
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    throw error
  }
}

// Get booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`/api/bookings/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error)
    throw error
  }
}

// Admin: Get all bookings
export const getAllBookings = async () => {
  try {
    const response = await axios.get("/api/bookings")
    return response.data
  } catch (error) {
    console.error("Error fetching all bookings:", error)
    throw error
  }
}

// Admin: Update booking status
export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.put(`/api/bookings/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error updating booking status for ${id}:`, error)
    throw error
  }
}

export const completeBooking = async (body) => {
  try {
    const response = await axios.post(`/bookings/completeBooking`, body)
    return response.data
  } catch (error) {
    console.error(`Error :`, error)
    throw error
  }
}

