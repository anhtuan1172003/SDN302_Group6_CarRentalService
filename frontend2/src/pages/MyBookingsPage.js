import React, { useEffect, useState } from "react"
import { getUserBookings } from "../services/bookingService"
import { Loader2 } from "lucide-react"

const MyBookingPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings()
        setBookings(data)
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu!")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách xe đã đặt</h1>

      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-gray-500">Bạn chưa đặt xe nào.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="border rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold">
              {booking.car_id?.brand} {booking.car_id?.model} -{" "}
              <span className="text-gray-500">{booking.car_id?.license_plate}</span>
            </h2>
            <p>Ngày bắt đầu: {new Date(booking.start_date_time).toLocaleDateString()}</p>
            <p>Ngày kết thúc: {new Date(booking.end_date_time).toLocaleDateString()}</p>
            <p>Tổng tiền: <strong>{booking.total_amount} VNĐ</strong></p>
            <span className={`px-2 py-1 text-white text-sm rounded ${booking.booking_status === "confirmed" ? "bg-green-500" : booking.booking_status === "cancelled" ? "bg-red-500" : "bg-gray-400"}`}>
              {booking.booking_status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookingPage
