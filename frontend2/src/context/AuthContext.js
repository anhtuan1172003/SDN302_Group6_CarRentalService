import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get("/users/profile")
          setUser(res.data)
        } catch (error) {
          console.error("Error loading user:", error)
          localStorage.removeItem("token")
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post("/users", userData)
      setToken(res.data.token)
      localStorage.setItem("token", res.data.token)
      setUser(res.data)
      toast.success("Registration successful!")
      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.response?.data?.message || "Registration failed")
      return false
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post("/users/login", { email, password })
      setToken(res.data.token)
      localStorage.setItem("token", res.data.token)
      setUser(res.data)
      toast.success("Login successful!")
      return true
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Invalid credentials")
      return false
    }
  }

  // Logout user
  const logout = async () => {
    try {
      if (token) {
        await axios.post("/users/logout")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }

    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    toast.info("Logged out successfully")
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put("/users/profile", userData)
      setUser(res.data)
      toast.success("Profile updated successfully")
      return true
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
      return false
    }
  }

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role_id && user.role_id === "admin"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

