// src/components/auth/AdminRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("AdminRoute - User:", user);
  console.log("AdminRoute - isAdmin:", isAdmin());

  if (!user || !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;