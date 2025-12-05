// src/components/Dashboard/ARViewStatistics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../utils/socket";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ARViewStatistics({ restaurantId }) {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [totalWeekClicks, setTotalWeekClicks] = useState(0);

  // Get last 7 days in YYYY-MM-DD
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }));
    }
    return dates;
  };

  const fetchWeeklyStats = async () => {
    if (!restaurantId) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/ar/stats/${restaurantId}`);
      const data = res.data.stats || [];

      const last7Days = getLast7Days();

      const chartData = last7Days.map((date) => {
        const totalClicks = data
          .filter((s) => s.date === date)
          .reduce((sum, s) => sum + s.clicks, 0);
        return { date, clicks: totalClicks };
      });

      setWeeklyStats(chartData);
      setTotalWeekClicks(chartData.reduce((sum, d) => sum + d.clicks, 0));
    } catch (err) {
      console.error("Failed to fetch weekly AR stats:", err);
    }
  };

  useEffect(() => {
    const Fetch = ()=>{
      fetchWeeklyStats();
    }
    Fetch()
  }, [restaurantId]);

  // Live updates for today
  useEffect(() => {
    socket.on("ar-updated", (data) => {
      if (data.restaurantId === restaurantId) {
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        setWeeklyStats((prev) => {
          const newStats = [...prev];
          const index = newStats.findIndex((d) => d.date === today);
          if (index >= 0) {
            newStats[index] = { ...newStats[index], clicks: newStats[index].clicks + 1 };
          }
          return newStats;
        });

        setTotalWeekClicks((prev) => prev + 1);
      }
    });

    return () => socket.off("ar-updated");
  }, [restaurantId]);

  return (
    <div className="relative h-full group bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 shadow-[0_0_25px_-10px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-[0_0_37px_-10px_rgba(30,58,138,0.6)]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">AR Views - Last 7 Days</h2>
        <p className="text-blue-400 font-bold">{totalWeekClicks} views this week</p>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyStats} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#2c2c2c" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Bar dataKey="clicks" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
