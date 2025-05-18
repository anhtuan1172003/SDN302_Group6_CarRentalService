"use client"

import { useState } from "react"
import axios from "axios"
import { useParams, useHistory } from "react-router-dom"

function Booking() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { carId } = useParams()
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://cc210d749504.sn.mynetname.net:8386/api/bookings", {
        car_id: carId,
        start_date_time: startDate,
        end_date_time: endDate,
        // Add other necessary fields
      })
      alert("Booking successful!")
      history.push("/")
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Booking failed. Please try again.")
    }
  }

  return (
    <div>
      <h2>Book a Car</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Book Now
        </button>
      </form>
    </div>
  )
}

export default Booking

