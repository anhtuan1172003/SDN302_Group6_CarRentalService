import axios from "axios"

// Get all approved cars
export const getApprovedCars = async () => {
  try {
    const response = await axios.get("/cars")
    return response.data
  } catch (error) {
    console.error("Error fetching cars:", error)
    throw error
  }
}

// Get car by ID
export const getCarById = async (id) => {
  try {
    const response = await axios.get(`/cars/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching car ${id}:`, error)
    throw error
  }
}

// Create a new car
export const createCar = async (carData) => {
  try {
    const formData = new FormData()

    // Add car details to form data
    Object.keys(carData).forEach((key) => {
      if (key !== "images" && key !== "documents") {
        formData.append(key, carData[key])
      }
    })

    // Add images to form data
    if (carData.images && carData.images.length > 0) {
      carData.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    // Add documents to form data
    if (carData.documents && carData.documents.length > 0) {
      carData.documents.forEach((doc) => {
        formData.append("documents", doc)
      })
    }

    const response = await axios.post("/api/cars", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error creating car:", error)
    throw error
  }
}

// Update a car
export const updateCar = async (id, carData) => {
  try {
    const formData = new FormData()

    // Add car details to form data
    Object.keys(carData).forEach((key) => {
      if (key !== "images" && key !== "documents") {
        formData.append(key, carData[key])
      }
    })

    // Add images to form data
    if (carData.images && carData.images.length > 0) {
      carData.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    // Add documents to form data
    if (carData.documents && carData.documents.length > 0) {
      carData.documents.forEach((doc) => {
        formData.append("documents", doc)
      })
    }

    const response = await axios.put(`/api/cars/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error(`Error updating car ${id}:`, error)
    throw error
  }
}

// Get user's cars
export const getUserCars = async () => {
  try {
    const response = await axios.get("/api/cars/user")
    return response.data
  } catch (error) {
    console.error("Error fetching user cars:", error)
    throw error
  }
}

// Admin: Get all cars
export const getAllCars = async () => {
  try {
    const response = await axios.get("/api/cars/admin")
    return response.data
  } catch (error) {
    console.error("Error fetching all cars:", error)
    throw error
  }
}

// Admin: Update car approval status
export const updateCarApproval = async (id, status) => {
  try {
    const response = await axios.put(`/api/cars/${id}/approve`, { car_approved: status })
    return response.data
  } catch (error) {
    console.error(`Error updating car approval status for ${id}:`, error)
    throw error
  }
}

// Admin: Delete a car
export const deleteCar = async (id) => {
  try {
    const response = await axios.delete(`/api/cars/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting car ${id}:`, error)
    throw error
  }
}
//Get all feedback of car
export const getCarFeedback = async (carId) => {
  try {
    const { data } = await axios.get(`cars/feedback/${carId}`)
    console.log(data);
    return data
  } catch (error) {
    throw new Error("Failed to fetch car feedback.")
  }
}

