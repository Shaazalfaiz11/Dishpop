import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/AxiosClient";

function makeSlug(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AddDishPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const RESTAURANT_ID = restaurantId ;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    available: true,
    isVeg: false,
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Auto slug
  useEffect(() => {
    const id = setTimeout(() => {
      setForm((s) => ({ ...s, slug: makeSlug(s.name) }));
    }, 200);
    return () => clearTimeout(id);
  }, [form.name]);

  // Load categories from dishes list
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get(`/restaurants/${RESTAURANT_ID}/menu`);
        const dishes = res.data?.data?.dishes ?? [];

        const unique = [...new Set(dishes.map((d) => d.category || "Uncategorized"))];
        setCategories(unique);
      } catch (err) {
        console.log("Category fetch failed:", err);
      }
    })();
  }, [RESTAURANT_ID]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  function validate() {
    const e = {};
    if (!form.name || form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    }
    if (!form.price || Number(form.price) <= 0) {
      e.price = "Enter valid price.";
    }
    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) e.image = "Only images allowed.";
      if (imageFile.size > 5 * 1024 * 1024)
        e.image = "Max file size is 5MB.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSelectFile(e) {
    const files = e.target.files;
    const f = files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErrors({ image: "Only images allowed" });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrors({ image: "Image must be < 5MB" });
      return;
    }

    setErrors({});
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // final category: existing OR new
    const finalCategory =
      newCategory.trim() !== "" ? newCategory : form.category;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", finalCategory);
    fd.append("available", form.available);
    fd.append("isVeg", form.isVeg);
    if (imageFile) fd.append("image", imageFile);

    try {
      setSubmitting(true);
      setToast({ type: "info", message: "Uploading..." });

      await axiosClient.post(`/restaurants/${RESTAURANT_ID}/menu`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / (p.total || 1));
          setProgress(percent);
        },
      });

      setToast({ type: "success", message: "Dish added successfully!" });
      setTimeout(() => navigate(-1), 700);
    } catch (err) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Upload failed",
      });
    }

    setSubmitting(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setErrors({});
  };

  const triggerFileInput = () => {
    document.getElementById("imageUpload").click();
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Add New Dish</h1>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              toast.type === "error"
                ? "bg-red-900/30 text-red-300 border border-red-800/50"
                : toast.type === "success"
                ? "bg-green-900/30 text-green-300 border border-green-800/50"
                : "bg-blue-900/30 text-blue-300 border border-blue-800/50"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800">
          <form onSubmit={handleSubmit}>
            {/* Basic Dish Details Section */}
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">Basic Dish Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dish Name */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="Enter dish name"
                    value={form.name}
                    onChange={onChange}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="0"
                    value={form.price}
                    onChange={onChange}
                  />
                  {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 transition-colors appearance-none cursor-pointer"
                    value={form.category}
                    onChange={onChange}
                  >
                    <option value="">Choose category</option>
                    {categories.map((c, index) => (
                      <option key={index} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* New Category Input */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Or Create New Category
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                  placeholder="Enter dish description..."
                  value={form.description}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Dish Images Section */}
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">Dish Image</h2>
              
              {/* Upload Area */}
              {!previewUrl ? (
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-700 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="imageUpload"
                    onChange={onSelectFile}
                  />
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-white text-sm mb-1">Drag & drop image here or click to upload</p>
                    <p className="text-zinc-500 text-xs">Maximum file size: 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-sm h-48 object-cover rounded-lg border border-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {submitting && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-lg overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {errors.image && (
                <p className="text-xs text-red-400 mt-2">{errors.image}</p>
              )}
            </div>

            {/* Toggles Section */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={form.available}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${form.available ? 'bg-blue-600' : 'bg-zinc-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${form.available ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <span className="text-sm text-zinc-300">Available</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={form.isVeg}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${form.isVeg ? 'bg-green-600' : 'bg-zinc-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${form.isVeg ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <span className="text-sm text-zinc-300">Vegetarian</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Dish"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}