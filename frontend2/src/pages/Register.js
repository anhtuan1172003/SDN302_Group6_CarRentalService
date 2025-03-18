"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

function Register() {
  const [step, setStep] = useState(1); // 1: Nhập tên và email, 2: Nhập mật khẩu
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // Mã xác thực
  const [userInputCode, setUserInputCode] = useState(""); // Mã người dùng nhập
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Tạo mã xác thực ngẫu nhiên
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Mã 6 chữ số
  };

  // Gửi email xác thực qua EmailJS
  const sendVerificationEmail = async () => {
    const code = generateVerificationCode();
    setVerificationCode(code);

    const templateParams = {
      to_email: email,
      user_name: name || "User",
      verification_code: code,
    };

    try {
      const response = await emailjs.send(
        "service_mf7gzq9", // Thay bằng Service ID của bạn
        "template_rzeyzgr", // Thay bằng Template ID của bạn
        templateParams,
        "5jBZWtO7P_-ZoiBqI" // Public Key của bạn
      );
      console.log("Email sent successfully:", response);
      setMessage("Verification code sent to your email. Please check your inbox (and spam folder).");
      setError(null);
      setStep(2); // Chuyển sang bước nhập mật khẩu và mã xác thực
    } catch (err) {
      console.error("Email sending failed:", err);
      setError("Failed to send verification email. Please try again.");
      setMessage(null);
    }
  };

  // Xử lý bước 1: Gửi email xác thực
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please enter both name and email.");
      return;
    }
    sendVerificationEmail();
  };

  // Xử lý bước 2: Đăng ký tài khoản
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8386/users", {
        name,
        email,
        password,
      });
      console.log("Registration response:", response.data);
      setMessage("Registration successful! ");
      setError(null);
      setTimeout(() => navigate("/login"), 2000); // Chuyển hướng về trang chủ
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Bước 1: Nhập tên và email */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send Verification Code
          </button>
        </form>
      )}

      {/* Bước 2: Nhập mã xác thực và mật khẩu */}
      {step === 2 && (
        <form onSubmit={handleRegisterSubmit}>
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              className="form-control"
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              required
              placeholder="Enter the code sent to your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;