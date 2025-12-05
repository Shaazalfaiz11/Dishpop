import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function ModelInsights({ restaurantId }) {
  const [topModels, setTopModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopModels = async () => {
      try {
        if (!restaurantId) return; // ensure restaurantId is provided

        const { data } = await api.get("/ar-stats/top", {
          params: { limit: 10, restaurantId }
        });

        setTopModels(data.topItems);
      } catch (error) {
        console.error("Failed to load insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopModels();
  }, [restaurantId]);

  return (
    <div className="relative group bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 shadow-md">
      <h2 className="text-base font-medium mb-1">3D Model Insights</h2>
      <p className="text-xs text-gray-400 mb-4">Top-performing AR dishes</p>

      {loading ? (
        <p className="text-xs text-gray-500">Loading...</p>
      ) : topModels.length === 0 ? (
        <p className="text-xs text-gray-500">No performance data found.</p>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-scroll pr-1 hide-scrollbar">
          {topModels.map((model, index) => (
            <div
              key={model.itemName}
              className="flex items-center gap-3 bg-[#11141D] p-2 rounded-lg border border-gray-800"
            >
              <img
                src={model.imageUrl}
                alt={model.itemName}
                className="w-10 h-10 rounded-md object-cover"
              />

              <div className="flex-1">
                <p className="text-xs font-medium text-gray-100">{model.itemName}</p>
                <p className="text-[10px] text-gray-400">{model.totalClicks} AR Views</p>
              </div>

              {index === 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-pink-600 text-white rounded-sm">
                  🔥 Trending
                </span>
              )}
              {index === 1 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded-sm">
                  Popular
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
