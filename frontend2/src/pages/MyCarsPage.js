import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Card, Button, Image, Carousel, Badge, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import { getCarById } from "../services/carService"; 

import AuthContext from "../context/AuthContext";
import Loader from "../components/ui/Loader";
import Message from "../components/ui/Message";

const MyCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [car, setCar] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (!id) {
          setError("Invalid car ID");
          setLoading(false);
          return;
        }
        const data = await getCarById(id);
        if (!data) {
          setError("Car not found");
        } else {
          setCar(data);
        }
      } catch (error) {
        setError("Failed to load car details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  return (
    <>
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
                        alt={`${car.title} - ${index + 1}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <Image
                  src="/placeholder.jpg"
                  alt={car.title}
                  fluid
                  className="rounded"
                  style={{ height: "400px", objectFit: "cover", width: "100%" }}
                />
              )}
            </Col>

            <Col md={5}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title as="h2">{car.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{car.subtitle}</Card.Subtitle>

                  <div className="my-3">
                    <Badge bg={car.status === "active" ? "success" : "danger"} className="me-2">
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </Badge>
                  </div>

                  <Card.Text as="h3" className="text-primary mb-4">
                    ${car.price}
                  </Card.Text>

                  <ListGroup variant="flush" className="mb-4">
                    <ListGroup.Item>
                      <i className="fas fa-info-circle me-2"></i> Description: {car.description}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-calendar me-2"></i> Date Added: {car.date_added}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <Tabs defaultActiveKey="details" className="mb-3">
                <Tab eventKey="details" title="Details">
                  <Card className="p-4">
                    <Card.Text>{car.details || "No additional details available."}</Card.Text>
                  </Card>
                </Tab>
                <Tab eventKey="terms" title="Terms of Use">
                  <Card className="p-4">
                    <Card.Text>{car.terms_of_use}</Card.Text>
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
  );
};

export default MyCardPage;
