import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import emailjs from "emailjs-com";

// Set base URL for API requests
axios.defaults.baseURL = "http://localhost:8386";

// Khởi tạo EmailJS với Public Key
emailjs.init("5jBZWtO7P_-ZoiBqI"); // Thay "your_public_key" bằng Public Key từ EmailJS

const root = ReactDOM.createRoot(document.getElementById("root")); // Sửa getElementId thành getElementById
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);