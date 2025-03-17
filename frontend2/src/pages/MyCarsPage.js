"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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

  const [card, setCar] = useState(null); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data = await getCarById(id);
        setCar(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load card details. Please try again later.");
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  return (
    <>
      

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : card ? (
        <>
          <Row>
            <Col md={7}>
              {card.image_url && card.image_url.length > 0 ? (
                <Carousel>
                  {card.image_url.map((img, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 rounded"
                        src={img || "/placeholder.svg"}
                        alt={`${card.title} - ${index + 1}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <Image
                  src="/placeholder.jpg"
                  alt={card.title}
                  fluid
                  className="rounded"
                  style={{ height: "400px", objectFit: "cover", width: "100%" }}
                />
              )}
            </Col>

            <Col md={5}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title as="h2">{card.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{card.subtitle}</Card.Subtitle>

                  <div className="my-3">
                    <Badge bg={card.status === "active" ? "success" : "danger"} className="me-2">
                      {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                    </Badge>
                  </div>

                  <Card.Text as="h3" className="text-primary mb-4">
                    ${card.price}
                  </Card.Text>

                  <ListGroup variant="flush" className="mb-4">
                    <ListGroup.Item>
                      <i className="fas fa-info-circle me-2"></i> Description: {card.description}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-calendar me-2"></i> Date Added: {card.date_added}
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
                    <Card.Text>{card.details || "No additional details available."}</Card.Text>
                  </Card>
                </Tab>
                <Tab eventKey="terms" title="Terms of Use">
                  <Card className="p-4">
                    <Card.Text>{card.terms_of_use}</Card.Text>
                  </Card>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </>
      ) : (
        <Message>Card not found</Message>
      )}
    </>
  );
};

export default MyCardPage;
