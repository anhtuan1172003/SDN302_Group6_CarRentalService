import axios from "axios";

// Use a base URL from an environment variable or config, fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8386";

// Hàm lấy danh sách người dùng
export const getAllUsers = async (page, limit, name, age) => {
  try {
    console.log("Calling getAllUsers with params:", { page, limit, name, age });
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: {
        page,
        limit,
        name: name || undefined,
        age: age || undefined,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("getAllUsers response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getAllUsers:", error.response || error);
    throw error;
  }
};

// Hàm lấy chi tiết người dùng
export const getUserById = async (id) => {
    try {
      console.log("Calling getUserById with id:", id);
      const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("getUserById response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getUserById:", error.response || error);
      throw error;
    }
  };

// Hàm xóa người dùng
export const deleteUser = async (id) => {
  try {
    console.log("Deleting user with ID:", id);
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteUser:", error.response || error);
    throw error;
  }
};