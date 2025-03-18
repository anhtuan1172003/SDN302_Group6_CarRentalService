"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import Loader from "../ui/Loader"

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext)

  if (loading) {
    return <Loader />
  }

  return user && isAdmin() ? children : <Navigate to="/" />
}

export default AdminRoute

