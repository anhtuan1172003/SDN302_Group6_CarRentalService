import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, updateCar } from "../services/carService";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const EditCarsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState({
    brand: "",
    model: "",
    base_price: "",
    car_status: "available",
    color: "",
    fuel_type: "",
    transmission_type: "",
    number_of_seats: "",
    mileage: "",
    fuel_consumption: "",
    description: "",
    images: [],
    documents: [],
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCarById(id);
        setCar(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load car details");
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setCar((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleDocChange = (e) => {
    const files = Array.from(e.target.files);
    setCar((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateCar(id, car);
      toast.success("Car updated successfully!");
      navigate("/cars");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update car");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Brand</Form.Label>
        <Form.Control type="text" name="brand" value={car.brand} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Model</Form.Label>
        <Form.Control type="text" name="model" value={car.model} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Base Price</Form.Label>
        <Form.Control type="number" name="base_price" value={car.base_price} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Upload Images</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Upload Documents</Form.Label>
        <Form.Control type="file" multiple onChange={handleDocChange} />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={updating}>
        {updating ? "Updating..." : "Update Car"}
      </Button>
    </Form>
  );
};

export default EditCarsPage;
