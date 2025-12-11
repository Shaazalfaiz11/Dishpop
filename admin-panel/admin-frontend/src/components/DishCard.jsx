// src/components/DishCard.jsx
export default function DishCard({
  dish,
  onUploadGlbClick,
  onUploadIosClick,
  onEditClick,
  onDeleteClick,
}) {
  return (
    <div className="p-4 bg-zinc-900 rounded border border-zinc-700 flex gap-4">
      {/* Left: image (if any) */}
      {dish.imageUrl && (
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      )}

      {/* Middle: info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{dish.name}</h3>

        {dish.category && (
          <p className="text-xs text-zinc-400 mb-1">
            Category: {dish.category}
          </p>
        )}

        <p className="text-zinc-300 text-sm mb-2 line-clamp-2">
          {dish.description}
        </p>

        <p className="text-green-400 font-bold mb-2">₹{dish.price}</p>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 text-xs mb-2">
          <span
            className={
              "px-2 py-1 rounded-full " +
              (dish.arModelUrl
                ? "bg-emerald-900 text-emerald-200"
                : "bg-zinc-800 text-zinc-300")
            }
          >
            GLB: {dish.arModelUrl ? "Ready" : "Not set"}
          </span>

          <span
            className={
              "px-2 py-1 rounded-full " +
              (dish.iosModelUrl
                ? "bg-indigo-900 text-indigo-200"
                : "bg-zinc-800 text-zinc-300")
            }
          >
            iOS: {dish.iosModelUrl ? "Ready" : "Not set"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onUploadGlbClick}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            {dish.arModelUrl ? "Update GLB" : "Upload GLB"}
          </button>

          <button
            onClick={onUploadIosClick}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm"
          >
            {dish.iosModelUrl ? "Update iOS" : "Upload iOS"}
          </button>

          <button
            onClick={onEditClick}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
          >
            Edit
          </button>

          <button
            onClick={onDeleteClick}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
