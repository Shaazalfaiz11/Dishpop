export default function DishFilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex gap-4 mb-4">
      {/* Category Filter */}
      <select
        className="bg-zinc-800 p-2 rounded"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "all" ? "All Categories" : cat}
          </option>
        ))}
      </select>

      {/* Sorting */}
      <select
        className="bg-zinc-800 p-2 rounded"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Sort: Name (A-Z)</option>
        <option value="priceLow">Price: Low → High</option>
        <option value="priceHigh">Price: High → Low</option>
        <option value="category">Sort: Category</option>
      </select>
    </div>
  );
}
