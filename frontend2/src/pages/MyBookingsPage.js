import { useEffect, useState } from "react"
import { completeBooking, getUserBookings } from "../services/bookingService"
import { Button, Col, Row, Table } from "react-bootstrap"
import Loader from "../components/ui/Loader"
import moment from "moment"
import { toast } from "react-toastify"
import handleCreatePaymentVNPay from "../utils/getUrlVNPay"
import { useLocation } from "react-router-dom"

export default function MyBookingsPage() {

    const [myBookings, setMyBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)

    const getMyBooking = async () => {
        try {
            setLoading(true)
            const res = await getUserBookings()
            setMyBookings(res)
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteBooking = async (booking) => {
        try {
            setLoading(true)
            const body = {
                amount: booking?.total_amount,
                payment_type: booking?.payment_method,
                transaction_type: "payment",
                description: "string",
                booking_id: booking?._id
            }
            const res = await completeBooking(body)
            localStorage.removeItem("booking")
            toast.success("Complete booking successfully")
            getMyBooking()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMyBooking()
    }, [])

    useEffect(() => {
        const bookingJson = localStorage.getItem("booking")
        if (!!JSON.parse(bookingJson)) {
            if (
                !!queryParams.get("vnp_ResponseCode") &&
                queryParams.get("vnp_ResponseCode") === "00"
            ) {
                handleCompleteBooking(JSON.parse(bookingJson))
            }
        }
    }, [location.search, localStorage.getItem("booking")])


    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <Row>
                    <Col md={12}>
                        <h2>My booking</h2>
                    </Col>
                    <Col md={12}>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Car Name</th>
                                    <th>Total Amount</th>
                                    <th>Deposit</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Booking Status</th>
                                    <th>Funtion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !!myBookings?.length ?
                                        myBookings?.map((i, idx) =>
                                            <tr key={i?._id}>
                                                <td>{idx + 1}</td>
                                                <td>{i?.car_id?.name}</td>
                                                <td>{i?.total_amount}$</td>
                                                <td>{i?.deposit}$</td>
                                                <td>{moment(i?.start_date_time).format("DD/MM/YYYY HH:mm")}</td>
                                                <td>{moment(i?.end_date_time).format("DD/MM/YYYY HH:mm")}</td>
                                                <td>{i?.booking_status}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => {
                                                            localStorage.setItem("booking", JSON.stringify(i))
                                                            handleCreatePaymentVNPay(
                                                                "Thanh toán booking",
                                                                i?.total_amount * 100 * 23000,
                                                                `http://cc210d749504.sn.mynetname.net:3000${location.pathname}`
                                                            )
                                                        }}
                                                    >
                                                        Payment
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                        : <h4>No data</h4>
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </div>
    )
}
