import axios from "axios"
export const createFeedback = async (data) => {
    const res = await axios.post("/feedbacks", data)
    return res.data
  }
  
  export const getFeedbackByBookingId = async (bookingId) => {
    const res = await axios.get(`/feedbacks/booking/${bookingId}`)
    return res.data
  }