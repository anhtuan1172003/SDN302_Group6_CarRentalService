"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate() 

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const res = await axios.post("http://cc210d749504.sn.mynetname.net:8386/api/users/login", { email, password })
  //     localStorage.setItem("token", res.data.token)
  //     history.push("/")
  //   } catch (error) {
  //     console.error("Login error:", error)
  //     alert("Login failed. Please check your credentials.")
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Kiểm tra xem hàm có được gọi không
    try {
        const res = await axios.post("http://cc210d749504.sn.mynetname.net:8386/users/login", { email, password });
        console.log(res); // Kiểm tra phản hồi từ API
        if (res.data.token) {
          console.log("User ID from API:", res.data._id); // Kiểm tra _id từ API
            localStorage.setItem("token", res.data.token); // Lưu token vào localStorage
            localStorage.setItem("user_id", res.data._id);
            navigate("/"); // Điều hướng về trang chính
        } else {
            alert("Login failed. No token received.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please check your credentials.");
    }
};
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login

