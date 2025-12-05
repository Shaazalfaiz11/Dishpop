// src/pages/EditDishPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/AxiosClient";

import DishForm from "../../components/menu/EditDishForm";

export default function EditDishPage() {
  const { restaurantId, id } = useParams();
  const navigate = useNavigate();
  const RESTAURANT_ID = restaurantId;

  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      // 1️⃣ Try menu route (if you created GET /menu/:id)
      try {
        const res = await axiosClient.get(
          `/restaurants/${RESTAURANT_ID}/menu/${id}`
        );

        const data = res.data?.data ?? res.data;
        if (!cancelled) setInitial(data);
        setLoading(false);
        return;
      } catch {}

      // 2️⃣ Fallback to dish route
      try {
        const res2 = await axiosClient.get(`/dishes/${id}`);
        const data = res2.data?.data ?? res2.data;
        if (!cancelled) setInitial(data);
      } catch (err) {
        console.error("Failed to load dish", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [RESTAURANT_ID, id]);

  if (loading) return <div className="p-6 text-white">Loading dish...</div>;
  if (!initial) return <div className="p-6 text-white">Dish not found</div>;

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Dish</h1>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <DishForm
            mode="edit"
            initial={initial}
            restaurantId={RESTAURANT_ID}
            dishId={id}
            autosaveKey={`draft:restaurant:${RESTAURANT_ID}:dish:${id}`}
            onSuccess={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
}
