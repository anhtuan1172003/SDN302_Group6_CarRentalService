"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import Loader from "../ui/Loader"

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext)

//   if (loading) {
//     return <Loader />
//   }

//   return user ? children : <Navigate to="/login" />
// }


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  // Chỉ điều hướng nếu loading đã kết thúc và user thực sự không tồn tại
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default PrivateRoute

