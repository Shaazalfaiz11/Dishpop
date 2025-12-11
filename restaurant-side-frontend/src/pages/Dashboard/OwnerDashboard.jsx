import React, { useEffect, useState } from "react";
import ARViewStatistics from "./ArViewStatistics";
import FeedbackSummary from "./FeedbackSummary";
import ModelInsights from "./ModelsInsights";
import Sidebar from "../../components/Sidebar";
import TableOrdersOverview from "./TableOrderOverview";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // FIXED API PATHS ACCORDING TO BACKEND
        
const [resUser, resRestaurant] = await Promise.all([
  api.get("/auth/profile", { withCredentials: true }),
  api.get(`/v1/restaurant/${username}`, { withCredentials: true }),
]);



        setUser(resUser.data.user);
        setRestaurant(resRestaurant.data);

        localStorage.setItem("uname", resUser.data.user.username);
        localStorage.setItem("rid", resRestaurant.data._id);

      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load data";
        toast.error(msg);

        if (err.response?.status === 404) {
          navigate("/404", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [username, navigate]);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true });
      localStorage.clear();
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
        Loading...
      </div>
    );
  }

  if (!user || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
        <p>Error loading dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white flex relative">
      <Sidebar user={user} />
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg lg:text-2xl font-bold">
            Dashboard – @{user.username}
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 text-white text-sm"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ARViewStatistics restaurantId={restaurant._id} />
          </div>
          <div className="lg:col-span-1">
            <ModelInsights restaurantId={restaurant._id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <TableOrdersOverview restaurantId={restaurant._id} />
          <FeedbackSummary restaurantId={restaurant._id} />
        </div>

      </div>
    </div>
  );
}
