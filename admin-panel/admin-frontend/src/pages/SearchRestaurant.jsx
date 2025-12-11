import React, { useState } from "react";
import api from "../api/adminApi";

export default function SearchRestaurant({ onSelect }) {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get(`/restaurant/${id}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSelect(id, res.data);
    } catch {
      alert("Restaurant not found");
    }
    setLoading(false);
  }

  return (
    <div className="search-container">
      <input placeholder="Enter Restaurant ID" onChange={(e) => setId(e.target.value)} />
      <button onClick={search} disabled={loading}>
        Search
      </button>
    </div>
  );
}
