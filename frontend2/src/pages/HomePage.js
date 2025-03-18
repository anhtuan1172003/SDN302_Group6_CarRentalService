"use client"

import { useState, useEffect } from "react"
import { Row, Col, Button, Carousel, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import { getApprovedCars } from "../services/carService"
import CarCard from "../components/ui/CarCard"
import Loader from "../components/ui/Loader"
import Message from "../components/ui/Message"

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await getApprovedCars()
        // Get only available cars and limit to 6
        const availableCars = cars.filter((car) => car.car_status === "available").slice(0, 6)
        setFeaturedCars(availableCars)
        setLoading(false)
      } catch (error) {
        setError("Failed to load cars. Please try again later.")
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    // Redirect to cars page with search term
    window.location.href = `/cars?search=${searchTerm}`
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white p-5 rounded mb-5">
        <Row>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h1 className="display-4 fw-bold">Find Your Perfect Rental Car</h1>
            <p className="lead">
              Discover our wide range of vehicles for any occasion. From economy to luxury, we have the perfect car for
              your needs.
            </p>
            <Form onSubmit={handleSearch} className="mt-4">
              <Row>
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="Search by brand, model, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col xs={4}>
                  <Button type="submit" variant="light" className="w-100">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col md={6}>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100 rounded"
                  src="/images/hero-car-1.jpg"
                  alt="First slide"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 rounded"
                  src="/images/hero-car-2.jpg"
                  alt="Second slide"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 rounded"
                  src="/images/hero-car-3.jpg"
                  alt="Third slide"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </div>

      {/* Featured Cars Section */}
      <h2 className="text-center mb-4">Featured Cars</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {featuredCars.map((car) => (
              <Col key={car._id} sm={12} md={6} lg={4} className="mb-4">
                <CarCard car={car} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/cars" className="btn btn-outline-primary btn-lg">
              View All Cars
            </Link>
          </div>
        </>
      )}

      {/* How It Works Section */}
      <div className="how-it-works my-5 py-5">
        <h2 className="text-center mb-5">How It Works</h2>
        <Row>
          <Col md={4} className="text-center mb-4">
            <div className="icon-wrapper mb-3">
              <i className="fas fa-search fa-3x text-primary"></i>
            </div>
            <h4>Find Your Car</h4>
            <p>Browse our selection of cars and choose the one that fits your needs.</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="icon-wrapper mb-3">
              <i className="fas fa-calendar-alt fa-3x text-primary"></i>
            </div>
            <h4>Book Your Dates</h4>
            <p>Select your pickup and return dates and complete the booking process.</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="icon-wrapper mb-3">
              <i className="fas fa-car fa-3x text-primary"></i>
            </div>
            <h4>Enjoy Your Ride</h4>
            <p>Pick up your car and enjoy your journey with our reliable vehicles.</p>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default HomePage

