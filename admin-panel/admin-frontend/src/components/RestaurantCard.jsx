export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-5 bg-zinc-900 border border-zinc-700 rounded-lg 
                 hover:bg-zinc-800 hover:border-blue-500 
                 transition cursor-pointer shadow-sm"
    >
      <h2 className="text-xl font-semibold text-white">
        {restaurant.restaurantName}
      </h2>

      <p className="text-gray-400 text-sm mt-1">
        <strong>Email:</strong> {restaurant.email}
      </p>

      <p className="text-gray-400 text-sm">
        <strong>Owner:</strong> {restaurant.ownerName}
      </p>

      <p className="text-gray-400 text-sm">
        <strong>Phone:</strong> {restaurant.phone}
      </p>

      {restaurant.city && (
        <p className="text-gray-400 text-sm">
          <strong>Location:</strong> {restaurant.city}, {restaurant.state}
        </p>
      )}
    </div>
  );
}
