import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Thiết lập base URL cho axios
axios.defaults.baseURL = "http://localhost:8386"; // Adjusted to match backend routes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set axios default headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/users/profile");
        const userData = res.data;
        if (!userData || !userData._id) {
          throw new Error("Invalid user data");
        }
        console.log("Loaded user data:", userData);
        setUser({
          _id: userData._id,
          name: userData.name || userData.username, // Handle both name and username
          email: userData.email,
          role_id: userData.role_id, // Could be ID or object
        });
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.error("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post("/users", userData);
      const { token, refreshToken, ...userInfo } = res.data; // Adjust based on registerUser response
      setToken(token);
      localStorage.setItem("token", token);
      setUser({
        _id: userInfo._id,
        name: userInfo.name || userInfo.username,
        email: userInfo.email,
        role_id: userInfo.role_id,
      });
      toast.success("Registration successful!");
      navigate("/");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed";
      toast.error(errorMsg);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post("/users/login", { email, password });
      const { accessToken, id, name, email, role_id } = res.data; // Match loginUser response
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
      setUser({
        _id: id,
        name,
        email,
        role_id,
      });
      toast.success("Login successful!");
      navigate(isAdmin() ? "/admin" : "/"); // Redirect based on role
      return true;
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid credentials";
      toast.error(errorMsg);
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post("/users/logout"); // Call logout endpoint to clear refresh token
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put("/users/profile", userData);
      const updatedUser = res.data;
      setUser({
        _id: updatedUser._id,
        name: updatedUser.name || updatedUser.username,
        email: updatedUser.email,
        role_id: updatedUser.role_id,
      });
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile";
      toast.error(errorMsg);
      return false;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    if (!user || !user.role_id) return false;
    if (typeof user.role_id === "object" && user.role_id.name) {
      return user.role_id.name.toLowerCase() === "admin";
    }
    // If role_id is just an ID, you might need to fetch the role (optional)
    return false; // Default to false if role_id is not populated
  };

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
  );
};

export default AuthContext;