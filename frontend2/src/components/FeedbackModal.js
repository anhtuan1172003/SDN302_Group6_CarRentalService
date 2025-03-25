import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import axios from "axios"

export default function FeedbackModal({ show, onHide, bookingId, onSuccess }) {
    const [content, setContent] = useState("")
    const [rating, setRating] = useState(5)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await axios.post("/feedbacks", {
                booking_id: bookingId,
                content,
                rating,
            })
            toast.success("Feedback submitted successfully")
            onSuccess() 
            onHide()
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to submit feedback")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Leave your feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Your experience with the car..."
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
