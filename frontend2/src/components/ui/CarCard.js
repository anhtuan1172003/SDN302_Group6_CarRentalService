import { Card, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"

const CarCard = ({ car }) => {
  return (
    <Card className="my-3 rounded shadow-sm h-100">
      <Card.Img
        variant="top"
        src={car.image_url && car.image_url.length > 0 ? car.image_url[0] : "/placeholder.jpg"}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h5">
          {car.brand} {car.model}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{car.name}</Card.Subtitle>

        <div className="mb-2">
          <Badge bg={car.car_status === "available" ? "success" : "danger"}>
            {car.car_status.charAt(0).toUpperCase() + car.car_status.slice(1)}
          </Badge>
        </div>

        <Card.Text className="small">
          <i className="fas fa-gas-pump me-2"></i>
          {car.fuel_type}
          <span className="mx-2">|</span>
          <i className="fas fa-cog me-2"></i>
          {car.transmission_type}
          <span className="mx-2">|</span>
          <i className="fas fa-users me-2"></i>
          {car.number_of_seats} seats
        </Card.Text>

        <Card.Text as="h5" className="mt-auto text-primary">
          ${car.base_price}/day
        </Card.Text>

        <Link to={`/car/${car._id}`} className="btn btn-primary mt-2">
          View Details
        </Link>
      </Card.Body>
    </Card>
  )
}

export default CarCard

