"use client"

import { useState, useEffect } from "react"
import { Table, Button, Badge, Modal, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { getAllCars, updateCarApproval, deleteCar } from "../../services/carService"
import Loader from "../../components/ui/Loader"
import Message from "../../components/ui/Message"

const CarsPage = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [approvalStatus, setApprovalStatus] = useState("")

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const data = await getAllCars()
      setCars(data)
      setLoading(false)
    } catch (error) {
      setError("Failed to load cars. Please try again later.")
      setLoading(false)
    }
  }

  const handleApprovalClick = (car) => {
    setSelectedCar(car)
    setApprovalStatus(car.car_approved)
    setShowApprovalModal(true)
  }

  const handleDeleteClick = (car) => {
    setSelectedCar(car)
    setShowDeleteModal(true)
  }

  const handleApprovalSubmit = async () => {
    try {
      await updateCarApproval(selectedCar._id, approvalStatus)
      toast.success(`Car ${approvalStatus === "yes" ? "approved" : "rejected"} successfully`)
      setShowApprovalModal(false)
      fetchCars()
    } catch (error) {
      toast.error("Failed to update car approval status")
    }
  }

  const handleDeleteSubmit = async () => {
    try {
      await deleteCar(selectedCar._id)
      toast.success("Car deleted successfully")
      setShowDeleteModal(false)
      fetchCars()
    } catch (error) {
      toast.error("Failed to delete car")
    }
  }

  return (
    <>
      <h1 className="my-4">Manage Cars</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Car</th>
                <th>Owner</th>
                <th>Price</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>{car._id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {car.image_url && car.image_url.length > 0 && (
                        <img
                          src={car.image_url[0] || "/placeholder.svg"}
                          alt={car.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                          className="rounded"
                        />
                      )}
                      <div>
                        <strong>
                          {car.brand} {car.model}
                        </strong>
                        <p className="mb-0 text-muted small">{car.name}</p>
                      </div>
                    </div>
                  </td>
                  <td>{car.user_id}</td>
                  <td>${car.base_price}/day</td>
                  <td>
                    <Badge bg={car.car_status === "available" ? "success" : "danger"}>{car.car_status}</Badge>
                  </td>
                  <td>
                    <Badge bg={car.car_approved === "yes" ? "success" : "warning"}>
                      {car.car_approved === "yes" ? "Approved" : "Pending"}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => handleApprovalClick(car)}>
                      <i className="fas fa-check-circle"></i> Approval
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(car)}>
                      <i className="fas fa-trash"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Approval Modal */}
          <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Car Approval Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedCar && (
                <>
                  <p>
                    <strong>Car:</strong> {selectedCar.brand} {selectedCar.model} ({selectedCar.name})
                  </p>
                  <Form.Group controlId="approvalStatus">
                    <Form.Label>Approval Status</Form.Label>
                    <Form.Select value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
                      <option value="yes">Approved</option>
                      <option value="no">Not Approved</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleApprovalSubmit}>
                Update
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Car</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedCar && (
                <p>
                  Are you sure you want to delete {selectedCar.brand} {selectedCar.model} ({selectedCar.name})? This
                  action cannot be undone.
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteSubmit}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  )
}

export default CarsPage

