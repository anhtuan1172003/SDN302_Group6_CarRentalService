"use client"

import { useState, useEffect, useContext } from "react"
import { Form, Button, Row, Col, Alert } from "react-bootstrap"
import AuthContext from "../context/AuthContext" // Điều chỉnh đường dẫn nếu cần

const ChangePasswordPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext)

  // State cho dữ liệu thay đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Xóa thông báo lỗi sau 5 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Xử lý thay đổi dữ liệu mật khẩu
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  // Submit form thay đổi mật khẩu
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
  
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8386/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
  
      const data = await response.json();
      console.log("Response status:", response.status); // Debug
      console.log("Response data:", data); // Debug
      if (response.ok) {
        setMessage("Password changed successfully");
        setError(null);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        throw new Error(data.message || "Error changing password");
      }
    } catch (err) {
      setError(err.message);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };
  // Nếu chưa đăng nhập, không hiển thị trang
  if (!user) {
    return <div>Please log in to change your password.</div>
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2>Change Password</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {(loading || authLoading) && <Alert variant="info">Loading...</Alert>}

        <Form onSubmit={handlePasswordSubmit}>
          <Form.Group controlId="currentPassword" className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="confirmNewPassword" className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading || authLoading}>
            {loading || authLoading ? "Changing..." : "Change Password"}
          </Button>
        </Form>
      </Col>
    </Row>
  )
}

export default ChangePasswordPage