export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 cursor-pointer hover:bg-zinc-800 transition"
    >
      <h3 className="text-lg font-semibold">{restaurant.restaurantName}</h3>
      <p className="text-sm text-zinc-400">{restaurant.email}</p>
      <p className="text-sm text-zinc-400">{restaurant.phone}</p>
      <p className="text-sm text-blue-400">{restaurant.restaurantId}</p>
    </div>
  );
}
