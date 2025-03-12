"use client"

import { useState, useEffect } from "react"
import { Row, Col, Form, Button, Container } from "react-bootstrap"
import { useSearchParams } from "react-router-dom"
import { getApprovedCars } from "../services/carService"
import CarCard from "../components/ui/CarCard"
import Loader from "../components/ui/Loader"
import Message from "../components/ui/Message"

const CarListPage = () => {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([])
  const [selectedTransmission, setSelectedTransmission] = useState("")
  const [sortBy, setSortBy] = useState("price-asc")

  // Get unique values for filters
  const brands = [...new Set(cars.map((car) => car.brand))]
  const fuelTypes = [...new Set(cars.map((car) => car.fuel_type))]
  const transmissionTypes = [...new Set(cars.map((car) => car.transmission_type))]

  // Maximum price in the dataset
  const maxPrice = cars.length > 0 ? Math.max(...cars.map((car) => car.base_price)) : 1000

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsData = await getApprovedCars()
        setCars(carsData)
        setFilteredCars(carsData)

        // Update price range based on actual data
        if (carsData.length > 0) {
          const max = Math.max(...carsData.map((car) => car.base_price))
          setPriceRange({ min: 0, max })
        }

        setLoading(false)
      } catch (error) {
        setError("Failed to load cars. Please try again later.")
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...cars]

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(
        (car) =>
          car.brand.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search) ||
          car.name.toLowerCase().includes(search) ||
          car.description.toLowerCase().includes(search),
      )
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((car) => selectedBrands.includes(car.brand))
    }

    // Apply fuel type filter
    if (selectedFuelTypes.length > 0) {
      result = result.filter((car) => selectedFuelTypes.includes(car.fuel_type))
    }

    // Apply transmission filter
    if (selectedTransmission) {
      result = result.filter((car) => car.transmission_type === selectedTransmission)
    }

    // Apply price range filter
    result = result.filter((car) => car.base_price >= priceRange.min && car.base_price <= priceRange.max)

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.base_price - b.base_price)
        break
      case "price-desc":
        result.sort((a, b) => b.base_price - a.base_price)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        break
    }

    setFilteredCars(result)
  }, [cars, searchTerm, priceRange, selectedBrands, selectedFuelTypes, selectedTransmission, sortBy])

  const handleBrandChange = (e) => {
    const { value, checked } = e.target
    setSelectedBrands(checked ? [...selectedBrands, value] : selectedBrands.filter((brand) => brand !== value))
  }

  const handleFuelTypeChange = (e) => {
    const { value, checked } = e.target
    setSelectedFuelTypes(checked ? [...selectedFuelTypes, value] : selectedFuelTypes.filter((type) => type !== value))
  }

  const resetFilters = () => {
    setSearchTerm("")
    setPriceRange({ min: 0, max: maxPrice })
    setSelectedBrands([])
    setSelectedFuelTypes([])
    setSelectedTransmission("")
    setSortBy("price-asc")
  }

  return (
    <Container>
      <h1 className="my-4">Available Cars</h1>

      <Row>
        {/* Filters Sidebar */}
        <Col md={3}>
          <div className="filter-section p-3 border rounded mb-4">
            <h4>Filters</h4>
            <hr />

            <Form>
              {/* Search */}
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>

              {/* Price Range */}
              <Form.Group className="mb-3">
                <Form.Label>Price Range (per day)</Form.Label>
                <div className="d-flex justify-content-between">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
                <Form.Range
                  min={0}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                />
              </Form.Group>

              {/* Brand Filter */}
              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                {brands.map((brand) => (
                  <Form.Check
                    key={brand}
                    type="checkbox"
                    id={`brand-${brand}`}
                    label={brand}
                    value={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={handleBrandChange}
                  />
                ))}
              </Form.Group>

              {/* Fuel Type Filter */}
              <Form.Group className="mb-3">
                <Form.Label>Fuel Type</Form.Label>
                {fuelTypes.map((type) => (
                  <Form.Check
                    key={type}
                    type="checkbox"
                    id={`fuel-${type}`}
                    label={type}
                    value={type}
                    checked={selectedFuelTypes.includes(type)}
                    onChange={handleFuelTypeChange}
                  />
                ))}
              </Form.Group>

              {/* Transmission Filter */}
              <Form.Group className="mb-3">
                <Form.Label>Transmission</Form.Label>
                <Form.Select value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)}>
                  <option value="">All Transmissions</option>
                  {transmissionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button variant="secondary" onClick={resetFilters} className="w-100">
                Reset Filters
              </Button>
            </Form>
          </div>
        </Col>

        {/* Car Listings */}
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="mb-0">{filteredCars.length} cars found</p>
            <Form.Select style={{ width: "auto" }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </Form.Select>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : filteredCars.length === 0 ? (
            <Message>No cars found matching your criteria.</Message>
          ) : (
            <Row>
              {filteredCars.map((car) => (
                <Col key={car._id} sm={12} md={6} lg={4} className="mb-4">
                  <CarCard car={car} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default CarListPage

