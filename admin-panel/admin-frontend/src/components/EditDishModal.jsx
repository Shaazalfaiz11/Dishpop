import { useState, useEffect } from "react";

export default function EditDishModal({ dish, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  useEffect(() => {
    if (dish) {
      setForm({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        category: dish.category || ""
      });
    }
  }, [dish]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-lg w-96 border border-zinc-700">
        <h2 className="text-xl font-bold mb-4">Edit Dish</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-zinc-800"
          placeholder="Dish Name"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-zinc-800"
          placeholder="Description"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-zinc-800"
          placeholder="Price"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-zinc-800"
          placeholder="Category (optional)"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button className="px-3 py-2 bg-zinc-700 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-3 py-2 bg-blue-600 rounded"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
