import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchCars = async () => {
      if (!userId) {
        console.error("Không tìm thấy User ID trong localStorage");
        setLoading(false);
        return;
      }

      try {
        console.log("Đang lấy danh sách xe cho user:", userId);
        const response = await axios.get(`http://localhost:8386/cars/owner/${userId}`);
        console.log("Dữ liệu xe:", response.data);

        if (Array.isArray(response.data)) {
          setCars(response.data);
        } else {
          console.error("Dữ liệu API không hợp lệ:", response.data);
          setCars([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách xe:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [userId]);

  const handleEdit = (id) => {
    navigate(`/edit-car/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa xe này không?")) {
      try {
        await axios.delete(`http://localhost:8386/cars/${id}`);
        setCars((prevCars) => prevCars.filter((car) => car._id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa xe:", error);
      }
    }
  };

  return (
    <Container>
      <h2 className="mt-4">Danh sách xe của bạn</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : cars.length === 0 ? (
        <p>Chưa có xe nào.</p>
      ) : (
        <Row>
          {cars.map((car) => (
            <Col key={car._id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={car.image_url?.[0] || "/default-car.jpg"} />
                <Card.Body>
                  <Card.Title>{car.name}</Card.Title>
                  <Card.Text>Giá: {car.base_price} VNĐ</Card.Text>
                  <Button variant="primary" onClick={() => handleEdit(car._id)}>
                    Sửa
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDelete(car._id)}>
                    Xóa
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyCarsPage;
