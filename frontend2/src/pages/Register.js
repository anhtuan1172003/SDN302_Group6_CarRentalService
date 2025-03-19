"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8386/users", { name, email, password })
      alert("Registration successful! Please login.")
      navigate("/login")
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
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

        {/* Check box Terms & Conditions */}
        <div className="form-check mt-3">
          <input
            type="checkbox"
            id="terms"
            className="form-check-input"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="terms" className="form-check-label">
            I agree to the <a href="/term">Terms & Conditions</a>
          </label>
        </div>

        <button type="submit" className="btn btn-primary mt-3" disabled={!agree}>
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
