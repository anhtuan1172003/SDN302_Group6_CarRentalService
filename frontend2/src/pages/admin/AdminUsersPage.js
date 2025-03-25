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
  const [allUsers, setAllUsers] = useState([]);
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
  const [isSearching, setIsSearching] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCarDetailsModal, setShowCarDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch users when page changes (chỉ khi không tìm kiếm)
  useEffect(() => {
    if (!isSearching) {
      fetchUsers();
    }
  }, [currentPage, isSearching]);

  // Fetch users for pagination
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
      setFilteredUsers(usersArray);
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

  // Fetch all users when searching
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching all users for search...");
      const data = await getAllUsers(1); // Không truyền limit để lấy tất cả
      console.log("API response from getAllUsers (all users):", data);

      const usersArray = data.users || [];
      setAllUsers(usersArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all users:", error);
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
    const hasSearch = searchName || searchEmail;
    setIsSearching(hasSearch);

    if (hasSearch) {
      fetchAllUsers();
    } else {
      setFilteredUsers(users);
    }
  }, [searchName, searchEmail]);

  // Lọc dữ liệu khi allUsers thay đổi (khi tìm kiếm)
  useEffect(() => {
    if (isSearching) {
      let filtered = allUsers;

      if (searchName) {
        filtered = filtered.filter((user) =>
          (user.name || user.username || "")
            .toLowerCase()
            .includes(searchName.toLowerCase())
        );
      }

      if (searchEmail) {
        filtered = filtered.filter((user) =>
          (user.email || "")
            .toLowerCase()
            .includes(searchEmail.toLowerCase())
        );
      }

      setFilteredUsers(filtered);
    }
  }, [allUsers, searchName, searchEmail, isSearching]);

  const handleSearch = () => {
    // Không cần gọi lại API, vì đã xử lý trong useEffect
  };

  const handleClearFilters = () => {
    setSearchName("");
    setSearchEmail("");
    setIsSearching(false);
    setCurrentPage(1);
    fetchUsers();
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Hàm handleDetailsClick được cải thiện để xử lý lỗi và gỡ lỗi tốt hơn
  const handleDetailsClick = async (user) => {
    setLoadingDetails(true);
    setShowDetailsModal(true);
    try {
      console.log("Attempting to fetch user details for ID:", user._id);
      console.log("Auth context:", { userId: user._id, token: localStorage.getItem("token") }); // Kiểm tra token nếu có

      const userData = await getUserById(user._id);
      console.log("Response from getUserById:", userData);

      // Kiểm tra dữ liệu trả về có hợp lệ không
      if (!userData || (userData.message && !userData._id)) {
        throw new Error(userData?.message || "No valid user data returned");
      }

      setUserDetails(userData);
      console.log("Successfully set user details:", userData);
      setLoadingDetails(false);
    } catch (error) {
      console.error("Error fetching user details:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : "No response",
        request: error.request ? "Request made but no response" : "No request sent",
        stack: error.stack,
      });

      let errorMessage = "Failed to load user details.";
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 400:
            errorMessage = "Error 400: Bad request. Invalid user ID.";
            break;
          case 401:
            errorMessage = "Error 401: Unauthorized. Logging out...";
            setTimeout(() => logout(), 3000);
            break;
          case 403:
            errorMessage = "Error 403: Forbidden. Insufficient permissions.";
            break;
          case 404:
            errorMessage = "Error 404: User not found.";
            break;
          case 500:
            errorMessage = "Error 500: Internal server error. Please check server logs.";
            break;
          default:
            errorMessage = `Server error ${status}: ${error.response.data?.message || "Unknown error"}`;
        }
      } else if (error.request) {
        errorMessage = "Network error: Server is unreachable. Please check your connection.";
      } else {
        errorMessage = `Unexpected error: ${error.message}`;
      }

      setUserDetails(null); // Reset userDetails để hiển thị thông báo lỗi
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
      if (isSearching) {
        fetchAllUsers();
      } else {
        fetchUsers();
      }
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
          <div className=" Liberator mt-2">
            <Button variant="outline-primary" onClick={isSearching ? fetchAllUsers : fetchUsers}>
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

          {/* Pagination: Chỉ hiển thị khi không có tìm kiếm */}
          {!isSearching && totalPages > 1 && (
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

      {/* User Details Modal - Cập nhật thông báo lỗi */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetails ? (
            <Loader />
          ) : userDetails ? (
            <>
              <h5>User Information</h5>
              <p>
                <strong>Name:</strong>{" "}
                {userDetails.name || userDetails.username || "Not specified"}
              </p>
              <p>
                <strong>Age:</strong>{" "}
                {userDetails.date_of_birth
                  ? new Date().getFullYear() -
                    new Date(userDetails.date_of_birth).getFullYear()
                  : "Not specified"}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email || "Not specified"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {userDetails.address || "Not specified"}
              </p>

              <h5 className="mt-4">Cars Posted by User</h5>
              {userDetails.cars && userDetails.cars.length > 0 ? (
                <Row>
                  {userDetails.cars.map((car) => (
                    <Col md={4} key={car._id} className="mb-4">
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            {car.brand || car.make || "Unknown"} {car.model || ""}
                          </Card.Title>
                          <Card.Text>
                            <strong>Year:</strong>{" "}
                            {car.production_years || car.year || "N/A"}
                            <br />
                            <strong>Price per Day:</strong> $
                            {car.base_price || car.pricePerDay || "N/A"}
                          </Card.Text>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleCarDetailsClick(car)}
                          >
                            <i className="fas fa-eye"></i> Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Message variant="info">
                  This user has not posted any cars.
                </Message>
              )}
            </>
          ) : (
            <Message variant="danger">
              Failed to load user details. This may be due to a server error. Please try again or check server logs for more details.
              <div className="mt-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleDetailsClick(selectedUser || { _id: userDetails?._id })}
                >
                  Retry
                </Button>
              </div>
            </Message>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Car Details Modal */}
      <Modal
        show={showCarDetailsModal}
        onHide={() => setShowCarDetailsModal(false)}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Car Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCar ? (
            <>
              <p>
                <strong>Make:</strong> {selectedCar.make}
              </p>
              <p>
                <strong>Model:</strong> {selectedCar.model}
              </p>
              <p>
                <strong>Year:</strong> {selectedCar.year}
              </p>
              <p>
                <strong>Price per Day:</strong> ${selectedCar.pricePerDay}
              </p>
              <p>
                <strong>Posted on:</strong>{" "}
                {new Date(selectedCar.createdAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <Message variant="danger">
              Failed to load car details.
            </Message>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCarDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <p>
              Are you sure you want to delete{" "}
              {selectedUser.name || selectedUser.username}'s account? This
              action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}