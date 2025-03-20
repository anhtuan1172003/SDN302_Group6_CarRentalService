"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  Row,
  Col,
  Container,
  Card,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAllUsers,
  getUserById,
  deleteUser,
} from "../../services/userService";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

export default function AdminUsersPage() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search states
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCarDetailsModal, setShowCarDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch users when page changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching users with params:", {
        currentPage,
        usersPerPage,
      });
      const data = await getAllUsers(currentPage, usersPerPage);
      console.log("API response from getAllUsers:", data);

      const usersArray = data.users || [];
      setUsers(usersArray);
      setFilteredUsers(usersArray); // Ban đầu, danh sách lọc giống danh sách gốc
      setTotalUsers(data.totalUsers || 0);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      let errorMessage = "Failed to load users.";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage =
            "Error 404: The requested resource was not found.";
        } else if (error.response.status === 401) {
          errorMessage =
            "Error 401: Unauthorized. Your session may have expired. Logging out...";
          setTimeout(() => logout(), 3000);
        } else if (error.response.status === 403) {
          errorMessage =
            "Error 403: Forbidden. You lack permission to view users.";
        } else {
          errorMessage = `Server error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`;
        }
      } else if (error.request) {
        errorMessage = "Network error: Unable to connect to the server.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
    }
  };

  // Lọc người dùng dựa trên searchName và searchEmail
  useEffect(() => {
    let filtered = users;

    // Lọc theo tên
    if (searchName) {
      filtered = filtered.filter((user) =>
        (user.name || user.username || "")
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    // Lọc theo email
    if (searchEmail) {
      filtered = filtered.filter((user) =>
        (user.email || "")
          .toLowerCase()
          .includes(searchEmail.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    // Không ghi đè totalUsers và totalPages khi lọc
  }, [searchName, searchEmail, users]);

  const handleSearch = () => {
    // Không cần gọi lại API, vì đã lọc ở frontend
  };

  const handleClearFilters = () => {
    setSearchName("");
    setSearchEmail("");
    setFilteredUsers(users); // Reset danh sách lọc về danh sách gốc
    setCurrentPage(1);
    fetchUsers(); // Gọi lại API để lấy dữ liệu gốc
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDetailsClick = async (user) => {
    setLoadingDetails(true);
    setShowDetailsModal(true);
    try {
      const userData = await getUserById(user._id);
      console.log("User details from getUserById:", userData);
      setUserDetails(userData);
      setLoadingDetails(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      let errorMessage = "Failed to load user details.";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Error 404: User not found.";
        } else if (error.response.status === 401) {
          errorMessage = "Error 401: Unauthorized. Logging out...";
          setTimeout(() => logout(), 3000);
        } else {
          errorMessage = `Server error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`;
        }
      } else if (error.request) {
        errorMessage = "Network error: Unable to connect to the server.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      toast.error(errorMessage);
      setLoadingDetails(false);
    }
  };

  const handleCarDetailsClick = (car) => {
    setSelectedCar(car);
    setShowCarDetailsModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      console.log("Deleting user with ID:", selectedUser._id);
      await deleteUser(selectedUser._id);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Pagination logic
  const pageItems = [];
  for (let number = 1; number <= totalPages; number++) {
    pageItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="my-4">Manage Users</h1>

      {/* Search Form */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group controlId="searchName">
            <Form.Label>Search by Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="searchEmail">
            <Form.Label>Search by Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end gap-2">
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
          {(searchName || searchEmail) && (
            <Button variant="outline-secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error}
          <div className="mt-2">
            <Button variant="outline-primary" onClick={fetchUsers}>
              Retry
            </Button>
          </div>
        </Message>
      ) : filteredUsers.length === 0 ? (
        <Message variant="info">
          No users found.{" "}
          {(searchName || searchEmail) ? (
            <>
              Try adjusting your search filters or{" "}
              <Button variant="link" onClick={handleClearFilters} className="p-0">
                clear filters
              </Button>
              .
            </>
          ) : (
            "There are no users in the system. Please check if users have been added."
          )}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name || user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDetailsClick(user)}
                    >
                      <i className="fas fa-eye"></i> Details
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {pageItems}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}