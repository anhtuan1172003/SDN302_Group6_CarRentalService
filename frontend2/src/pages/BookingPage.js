"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col, Card, ListGroup, Image } from "react-bootstrap"
import { toast } from "react-toastify"
import { getCarById } from "../services/carService"
import { createBooking } from "../services/bookingService"
import AuthContext from "../context/AuthContext"
import Loader from "../components/ui/Loader"
import Message from "../components/ui/Message"

const BookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [driversInfo, setDriversInfo] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit_card")

  // Calculated values
  const [days, setDays] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCarById(id)

        // Check if car is available
        if (data.car_status !== "available") {
          setError("This car is not available for booking.")
          setLoading(false)
          return
        }

        setCar(data)
        setLoading(false)
      } catch (error) {
        setError("Failed to load car details. Please try again later.")
        setLoading(false)
      }
    }

    fetchCar()
  }, [id])

  // Calculate days and total amount when dates change
  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      // Calculate difference in days
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      setDays(diffDays)
      setTotalAmount(diffDays * car.base_price)
    } else {
      setDays(0)
      setTotalAmount(0)
    }
  }, [startDate, endDate, car])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates")
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      toast.error("End date must be after start date")
      return
    }

    if (days < 1) {
      toast.error("Booking must be for at least 1 day")
      return
    }

    setSubmitting(true)

    try {
      const bookingData = {
        car_id: id,
        start_date_time: startDate,
        end_date_time: endDate,
        drivers_information: driversInfo,
        payment_method: paymentMethod,
      }

      await createBooking(bookingData)
      toast.success("Booking created successfully!")
      navigate("/mybookings")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="my-4">Book a Car</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : car ? (
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Booking Details</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="startDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="endDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().slice(0, 16)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="driversInfo">
                    <Form.Label>Driver's Information</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={driversInfo}
                      onChange={(e) => setDriversInfo(e.target.value)}
                      placeholder="Enter driver's name, license number, etc."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="paymentMethod">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </Form.Select>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100 py-2" disabled={submitting || days < 1}>
                    {submitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Car Summary</Card.Title>
                <div className="text-center mb-3">
                  <Image
                    src={car.image_url && car.image_url.length > 0 ? car.image_url[0] : "/placeholder.jpg"}
                    alt={car.name}
                    fluid
                    className="rounded"
                    style={{ maxHeight: "150px", objectFit: "cover" }}
                  />
                </div>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>
                      {car.brand} {car.model}
                    </strong>
                    <p className="text-muted mb-0">{car.name}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <i className="fas fa-tag me-2"></i> ${car.base_price}/day
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <i className="fas fa-shield-alt me-2"></i> Deposit: ${car.deposit}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>Booking Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Duration:</span>
                    <span>{days} days</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Daily Rate:</span>
                    <span>${car.base_price}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Deposit:</span>
                    <span>${car.deposit}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between fw-bold">
                    <span>Total Amount:</span>
                    <span>${totalAmount}</span>
                  </ListGroup.Item>
                </ListGroup>
                <p className="text-muted mt-3 small">
                  Note: The deposit will be refunded after the car is returned in good condition.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Message>Car not found</Message>
      )}
    </>
  )
}

export default BookingPage

