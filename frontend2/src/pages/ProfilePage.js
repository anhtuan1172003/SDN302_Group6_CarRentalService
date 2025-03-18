"use client";

import { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import AuthContext from "../context/AuthContext";

const ProfilePage = () => {
  const { user, updateProfile, loading: authLoading } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    address: "",
    phone_no: "",
    date_of_birth: "",
    driving_license: "",
    national_id_no: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        phone_no: user.phone_no || "",
        date_of_birth: user.date_of_birth
          ? new Date(user.date_of_birth).toISOString().split("T")[0]
          : "",
        driving_license: user.driving_license || "",
        national_id_no: user.national_id_no || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const success = await updateProfile(profileData);
      if (success) {
        setMessage("Profile updated successfully");
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Error updating profile");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <Row>
      <Col md={4}>
        <h2>User Profile</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {(loading || authLoading) && <Alert variant="info">Loading...</Alert>}

        <Form onSubmit={handleProfileSubmit}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="address" className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Enter address"
              value={profileData.address}
              onChange={handleProfileChange}
            />
          </Form.Group>

          <Form.Group controlId="phone_no" className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone_no"
              placeholder="Enter phone number"
              value={profileData.phone_no}
              onChange={handleProfileChange}
            />
          </Form.Group>

          <Form.Group controlId="date_of_birth" className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              value={profileData.date_of_birth}
              onChange={handleProfileChange}
            />
          </Form.Group>

          <Form.Group controlId="driving_license" className="mb-3">
            <Form.Label>Driving License</Form.Label>
            <Form.Control
              type="text"
              name="driving_license"
              placeholder="Enter driving license"
              value={profileData.driving_license}
              onChange={handleProfileChange}
            />
          </Form.Group>

          <Form.Group controlId="national_id_no" className="mb-3">
            <Form.Label>National ID Number</Form.Label>
            <Form.Control
              type="text"
              name="national_id_no"
              placeholder="Enter national ID"
              value={profileData.national_id_no}
              onChange={handleProfileChange}
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading || authLoading}>
            {loading || authLoading ? "Updating..." : "Update Profile"}
          </Button>
        </Form>
      </Col>
      <Col md={8}>
        <h2>My Bookings</h2>
        {/* Thêm bảng hoặc danh sách bookings của người dùng tại đây */}
      </Col>
    </Row>
  );
}

export default ProfilePage;