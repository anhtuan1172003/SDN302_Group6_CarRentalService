// src/pages/DeleteAccountPage.js
import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

const DeleteAccountPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async () => {
    const code = generateVerificationCode();
    setVerificationCode(code);

    const templateParams = {
      to_email: user.email,
      user_name: user.name || "User",
      verification_code: code,
    };

    try {
      await emailjs.send(
        "service_mf7gzq9",
        "template_rzeyzgr",
        templateParams,
        "5jBZWtO7P_-ZoiBqI"
      );
      setMessage("Verification code sent to your email.");
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
      setStep(1);
    }
  };

  const handleConfirmDelete = () => {
    setStep(2);
    sendVerificationEmail();
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (userInputCode !== verificationCode) {
      setError("Invalid verification code.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8386/users/deleteaccount",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Account deleted successfully.");
        logout();
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(data.message || "Error deleting account");
      }
    } catch (err) {
      setError(err.message);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to delete your account.</div>;
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2>Delete Account</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Alert variant="info">Loading...</Alert>}

        {step === 1 && (
          <div>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <Button variant="danger" onClick={handleConfirmDelete} className="me-2">
              Yes
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              No
            </Button>
          </div>
        )}

        {step === 2 && (
          <Form onSubmit={handleVerifyCode}>
            <Form.Group controlId="verificationCode" className="mb-3">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the code sent to your email"
                value={userInputCode}
                onChange={(e) => setUserInputCode(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify and Delete"}
            </Button>
          </Form>
        )}
      </Col>
    </Row>
  );
};

export default DeleteAccountPage;