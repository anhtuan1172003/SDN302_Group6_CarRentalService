import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

// Layout Components
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

// Public Pages
import HomePage from "./pages/HomePage"
import CarListPage from "./pages/CarListPage"
import CarDetailsPage from "./pages/CarDetailsPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"

// Protected Pages
import ProfilePage from "./pages/ProfilePage"
import BookingPage from "./pages/BookingPage"
import MyBookingsPage from "./pages/MyBookingsPage"
import AddCarPage from "./pages/AddCarPage.js"
import MyCarsPage from "./pages/MyCarsPage.js"

// Admin Pages
import AdminDashboard from "./pages/admin/DashBoard.js"
import AdminCarsPage from "./pages/admin/CarsPage"
import AdminBookingsPage from "./pages/admin/BookingsPage"
import AdminUsersPage from "./pages/admin/UsersPage"

// Auth Components
import PrivateRoute from "./components/auth/PrivateRoute"
import AdminRoute from "./components/auth/AdminRoute"
import Login from "./pages/Login.js"
import Register from "./pages/Register.js"

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/cars" element={<CarListPage />} />
            <Route path="/car/:id" element={<CarDetailsPage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <PrivateRoute>
                  <BookingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/mybookings"
              element={
                <PrivateRoute>
                  <MyBookingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/addcar"
              element={
                <PrivateRoute>
                  <AddCarPage/>
                </PrivateRoute>
              }
            />
            <Route
              path="/mycars"
              element={
                <PrivateRoute>
                  <MyCarsPage />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/cars"
              element={
                <AdminRoute>
                  <AdminCarsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookingsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
          </Routes>
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
