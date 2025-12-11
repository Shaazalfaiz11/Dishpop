import { useEffect, useState } from "react";
import api from "../api/adminApi";
import RestaurantCard from "../components/RestaurantCard";
import Pagination from "../components/Pagination";

export default function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Logout function inside the same file
  function handleLogout() {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }

  async function loadRestaurants(page = 1) {
    try {
      setLoading(true);
      const res = await api.get(`/restaurants?page=${page}&search=${search}`);
      setRestaurants(res.data.restaurants || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Failed to load restaurants:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen text-white">

      {/* Header with LOGOUT button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurant Directory</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <input
          className="w-full max-w-md px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500 transition"
          placeholder="Search by email / name / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => loadRestaurants()}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-zinc-800 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {restaurants.map((r) => (
            <RestaurantCard
              key={r.email}
              restaurant={r}
              onClick={() => onSelectRestaurant(r.email)}
            />
          ))}

          {restaurants.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              No restaurants found
            </p>
          )}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={loadRestaurants} />
    </div>
  );
}
