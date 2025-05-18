"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function CarList() {
  const [cars, setCars] = useState([])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://cc210d749504.sn.mynetname.net:8386/api/cars")
        setCars(res.data)
      } catch (error) {
        console.error("Error fetching cars:", error)
      }
    }
    fetchCars()
  }, [])

  return (
    <div>
      <h2>Available Cars</h2>
      <div className="row">
        {cars.map((car) => (
          <div key={car._id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {car.brand} {car.model}
                </h5>
                <p className="card-text">{car.description}</p>
                <Link to={`/cars/${car._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarList

