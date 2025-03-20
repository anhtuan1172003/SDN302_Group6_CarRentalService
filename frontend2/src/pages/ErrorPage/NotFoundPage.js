import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h3 style={styles.message}>Page Not Found</h3>
      <Link to="/">
        <button style={styles.button}>Back to Home</button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
  },
  errorCode: {
    fontSize: "72px",
    fontWeight: "bold",
    color: "#dc3545",
  },
  message: {
    fontSize: "18px",
    color: "#333",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default NotFoundPage;
