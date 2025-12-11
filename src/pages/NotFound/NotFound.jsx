// src/pages/NotFound/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
      backgroundColor: "#f5f5f5",
      color: "#333",
      fontFamily: "Arial, sans-serif",
    }}>
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <h2 style={{ margin: "20px 0" }}>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderRadius: "5px",
        textDecoration: "none"
      }}>Go Home</Link>
    </div>
  );
}
