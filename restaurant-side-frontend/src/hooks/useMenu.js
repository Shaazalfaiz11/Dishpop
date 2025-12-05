// src/hooks/useMenu.js
import { useState, useEffect, useMemo, useCallback } from "react";
import menuApi from "../api/menuApi";
import { useParams } from "react-router-dom";

export default function useMenu() {
  // 🔥 FIX: useParams must be inside the hook
  const { restaurantId } = useParams();
  const RESTAURANT_ID = restaurantId;

  // Core states
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses] = useState(["All Statuses", "Available", "Unavailable"]);
  const [statistics, setStatistics] = useState(null);

  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("name-asc");

  // Loading + error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ------------------------------------------------------------
    1️⃣ Fetch menu (with retry + loading UI)
  ------------------------------------------------------------ */
  const fetchMenu = useCallback(async () => {
    if (!RESTAURANT_ID) return; // Prevent undefined crash

    setLoading(true);
    setError(null);

    try {
      const res = await menuApi.getMenu(RESTAURANT_ID);
      const data = res.data.data;
      const list = data.dishes ?? [];

      setDishes(list);

      setCategories([
        "All Categories",
        ...new Set(list.map((d) => d.category || "Uncategorized")),
      ]);

      setStatistics({
        total: list.length,
        available: list.filter((d) => d.available).length,
        byStatus: {
          ready: list.length,
          processing: 0,
        },
      });

      setLoading(false);
    } catch (e) {
      console.error("Menu fetch error:", e);
      setError("Failed to load menu");
      setLoading(false);

      setTimeout(fetchMenu, 2000);
    }
  }, [RESTAURANT_ID]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  /* ------------------------------------------------------------
    2️⃣ Debounce search
  ------------------------------------------------------------ */
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  /* ------------------------------------------------------------
    3️⃣ Filtering + Sorting
  ------------------------------------------------------------ */
  const filteredDishes = useMemo(() => {
    if (loading) return [];

    let list = [...dishes];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      list = list.filter((d) => d.category === selectedCategory);
    }

    // Availability filter
    if (selectedStatus !== "All Statuses") {
      const shouldBe = selectedStatus === "Available";
      list = list.filter((d) => d.available === shouldBe);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [dishes, debouncedSearch, selectedCategory, selectedStatus, sortBy, loading]);

  /* ------------------------------------------------------------
    4️⃣ Toggle availability
  ------------------------------------------------------------ */
  const toggleAvailability = async (dishId) => {
    const prevState = dishes;

    setDishes((prev) =>
      prev.map((d) =>
        d._id === dishId ? { ...d, available: !d.available } : d
      )
    );

    try {
      const res = await menuApi.toggleAvailability(RESTAURANT_ID, dishId);
      const newAvailable = res.data.data.available;

      setDishes((prev) =>
        prev.map((d) =>
          d._id === dishId ? { ...d, available: newAvailable } : d
        )
      );

      setStatistics((prev) => ({
        ...prev,
        available: newAvailable
          ? prev.available + 1
          : prev.available - 1,
      }));
    } catch (err) {
      console.error("toggleAvailability error:", err);
      setDishes(prevState);
    }
  };

  /* ------------------------------------------------------------
    5️⃣ Delete dish
  ------------------------------------------------------------ */
  const deleteDish = async (dishId) => {
    const previous = dishes;

    setDishes((prev) => prev.filter((d) => d._id !== dishId));

    try {
      await menuApi.deleteDish(RESTAURANT_ID, dishId);
    } catch (err) {
      console.error("Delete error:", err);
      setDishes(previous);
    }
  };

  /* ------------------------------------------------------------
    6️⃣ Auto refresh on tab focus
  ------------------------------------------------------------ */
  useEffect(() => {
    const onFocus = () => fetchMenu();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchMenu]);

  /* ------------------------------------------------------------
    7️⃣ Clear filters
  ------------------------------------------------------------ */
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Statuses");
    setSortBy("name-asc");
  };

  return {
    loading,
    error,
    dishes,
    filteredDishes,
    categories,
    statuses,
    statistics,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setSortBy,
    toggleAvailability,
    deleteDish,
    clearFilters,
  };
}
