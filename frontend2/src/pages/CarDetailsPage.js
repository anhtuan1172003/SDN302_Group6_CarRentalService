"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Row, Col, ListGroup, Card, Button, Image, Carousel, Badge, Tabs, Tab } from "react-bootstrap"
import { toast } from "react-toastify"
import { getCarById } from "../services/carService"
import AuthContext from "../context/AuthContext"
import Loader from "../components/ui/Loader"
import Message from "../components/ui/Message"

const CarDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCarById(id)
        setCar(data)
        setLoading(false)
      } catch (error) {
        setError("Failed to load car details. Please try again later.")
        setLoading(false)
      }
    }

    fetchCar()
  }, [id])

  const handleBookNow = () => {
    if (!user) {
      toast.info("Please login to book this car")
      navigate("/login")
    } else {
      navigate(`/booking/${id}`)
    }
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/cars">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : car ? (
        <>
          <Row>
            <Col md={7}>
              {car.image_url && car.image_url.length > 0 ? (
                <Carousel>
                  {car.image_url.map((img, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 rounded"
                        src={img || "/placeholder.svg"}
                        alt={`${car.brand} ${car.model} - ${index + 1}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <Image
                  src="/placeholder.jpg"
                  alt={car.name}
                  fluid
                  className="rounded"
                  style={{ height: "400px", objectFit: "cover", width: "100%" }}
                />
              )}
            </Col>

            <Col md={5}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title as="h2">
                    {car.brand} {car.model}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{car.name}</Card.Subtitle>

                  <div className="my-3">
                    <Badge bg={car.car_status === "available" ? "success" : "danger"} className="me-2">
                      {car.car_status.charAt(0).toUpperCase() + car.car_status.slice(1)}
                    </Badge>
                    <Badge bg="info">{car.production_years}</Badge>
                  </div>

                  <Card.Text as="h3" className="text-primary mb-4">
                    ${car.base_price}/day
                  </Card.Text>

                  <ListGroup variant="flush" className="mb-4">
                    <ListGroup.Item>
                      <i className="fas fa-palette me-2"></i> Color: {car.color}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-gas-pump me-2"></i> Fuel: {car.fuel_type}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-cog me-2"></i> Transmission: {car.transmission_type}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-users me-2"></i> Seats: {car.number_of_seats}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-tachometer-alt me-2"></i> Mileage: {car.mileage} km
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-gas-pump me-2"></i> Fuel Consumption: {car.fuel_consumption} L/100km
                    </ListGroup.Item>
                  </ListGroup>

                  <Button
                    onClick={handleBookNow}
                    className="w-100 py-2"
                    variant="primary"
                    disabled={car.car_status !== "available"}
                  >
                    {car.car_status === "available" ? "Book Now" : "Currently Unavailable"}
                  </Button>

                  {car.car_status !== "available" && (
                    <Card.Text className="text-danger text-center mt-2">
                      This car is currently {car.car_status}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <Tabs defaultActiveKey="description" className="mb-3">
                <Tab eventKey="description" title="Description">
                  <Card className="p-4">
                    <Card.Text>{car.description}</Card.Text>
                  </Card>
                </Tab>
                <Tab eventKey="features" title="Additional Features">
                  <Card className="p-4">
                    <Card.Text>{car.additional_functions || "No additional features specified."}</Card.Text>
                  </Card>
                </Tab>
                <Tab eventKey="terms" title="Terms of Use">
                  <Card className="p-4">
                    <Card.Text>{car.terms_of_use}</Card.Text>
                  </Card>
                </Tab>
                <Tab eventKey="location" title="Location">
                  <Card className="p-4">
                    <Card.Text>
                      <i className="fas fa-map-marker-alt me-2"></i> {car.address}
                    </Card.Text>
                    
                  </Card>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </>
      ) : (
        <Message>Car not found</Message>
      )}
    </>
  )
}

export default CarDetailsPage

