import React, { useState, memo } from "react";
import { Edit2, Trash2, Link as LinkIcon, RefreshCw } from "lucide-react";
import { STATUS_COLORS } from "../../utils/constants";

const DishCard = ({
  dish,
  onToggleAvailability,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  if (!dish) return null;

  const {
    name,
    description,
    imageUrl,
    category,
    price,
    available,
    status,
    preparationTime,
    tags,
    _id,
  } = dish;

  const safeTags = Array.isArray(tags) ? tags : [];
  const safeStatus = status || "Ready";
  const safeCategory = category || "Uncategorized";
  const safePrice = typeof price === "number" ? price : 0;

  const statusColor = STATUS_COLORS[safeStatus] || STATUS_COLORS["Ready"];

  // 👉 For smoother UX when clicking toggle
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (toggling) return; // Prevent rapid double-clicks
    setToggling(true);

    try {
      await onToggleAvailability(_id);
    } finally {
      setTimeout(() => setToggling(false), 200); // Keep tiny delay to feel smooth
    }
  };

  return (
    <div
      key={_id + "_" + available}
      className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
    >
      <div className="flex items-center gap-6">
        
        {/* Image */}
        <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Dish Info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1">{name}</h3>

          <p className="text-gray-400 text-sm mb-2">{safeCategory}</p>

          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
            {description || "No description"}
          </p>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {safeTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Price + Actions */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-500">₹{safePrice.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {preparationTime ? `${preparationTime} mins` : "N/A"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onEdit(dish)}
              className="p-2 text-gray-400 hover:text-blue-400 transition"
            >
              <Edit2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => onDelete(_id)}
              className="p-2 text-gray-400 hover:text-red-400 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-400 hover:text-cyan-400 transition">
              <LinkIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => onRefresh(_id)}
              className="p-2 text-gray-400 hover:text-green-400 transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Status */}
          <div
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusColor.bg} ${statusColor.text}`}
          >
            {safeStatus}
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400">Available</span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={available}
              onChange={handleToggle}
              disabled={toggling}
              className="peer sr-only"
            />

            {/* Track */}
            <div
              className={`w-14 h-7 rounded-full transition-colors duration-300
                ${available ? "bg-blue-600" : "bg-gray-700"}
                ${toggling ? "opacity-70" : ""}
              `}
            ></div>

            {/* Circle */}
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-300 
                ${available ? "translate-x-[28px]" : ""}
                ${toggling ? "scale-90" : "scale-100"}
              `}
            ></div>
          </label>
        </div>

      </div>
    </div>
  );
};

// Memoized to avoid unnecessary re-renders
export default memo(DishCard);
