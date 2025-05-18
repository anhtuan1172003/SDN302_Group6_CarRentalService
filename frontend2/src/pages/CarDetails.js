"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"

function CarDetails() {
  const [car, setCar] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`http://cc210d749504.sn.mynetname.net:8386/api/cars/${id}`)
        setCar(res.data)
      } catch (error) {
        console.error("Error fetching car details:", error)
      }
    }
    fetchCar()
  }, [id])

  if (!car) return <div>Loading...</div>

  return (
    <div>
      <h2>
        {car.brand} {car.model}
      </h2>
      <p>{car.description}</p>
      <p>Price: ${car.base_price} per day</p>
      <p>Fuel Type: {car.fuel_type}</p>
      <p>Transmission: {car.transmission_type}</p>
      <Link to={`/booking/${car._id}`} className="btn btn-success">
        Book Now
      </Link>
    </div>
  )
}

export default CarDetails

