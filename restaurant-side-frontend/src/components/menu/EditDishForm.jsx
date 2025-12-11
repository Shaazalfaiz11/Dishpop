// src/components/DishForm.jsx
import React, { useEffect, useRef, useState } from "react";
import useAutosave from "../../hooks/useAutoSave";
import { compressImage } from "../../utils/CompressImage";
import axiosClient from "../../api/AxiosClient"; // matches your naming

export default function DishForm({
  mode = "add",
  initial = {},
  restaurantId,
  dishId,
  autosaveKey = null,
  onSuccess = null,
  submitUrl = null,
}) {
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: initial.name || "",
    slug: initial.slug || "",
    description: initial.description || "",
    price: initial.price != null ? String(initial.price) : "",
    category: initial.category || "",
    available: initial.available ?? true,
    isVeg: initial.isVeg ?? false,
  });

  const [categories, setCategories] = useState(initial._categories || []);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImage, setExistingImage] = useState(initial.thumbnailUrl || initial.imageUrl || null);

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!autosaveKey) return;
    try {
      const raw = localStorage.getItem(autosaveKey);
      if (raw) {
        const draft = JSON.parse(raw);
        setForm((s) => ({ ...s, ...draft }));
      }
    } catch {}
  }, [autosaveKey]);

  useAutosave(autosaveKey, form, { debounceMs: 800 });

  useEffect(() => {
    const id = setTimeout(() => {
      setForm((s) => ({ ...s, slug: makeSlug(s.name) }));
    }, 200);
    return () => clearTimeout(id);
  }, [form.name]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await axiosClient.get(`/restaurants/${restaurantId}/categories`);
        const data = res.data?.data ?? res.data;

        if (!cancelled && Array.isArray(data)) setCategories(data);
        return;
      } catch {}

      try {
        const res2 = await axiosClient.get(`/restaurants/${restaurantId}/menu`);
        const dishes = res2.data?.data?.dishes ?? [];
        const unique = [...new Set(dishes.map((d) => d.category || "Uncategorized"))];

        if (!cancelled) setCategories(unique);
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function makeSlug(text = "") {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.price || Number.isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter valid price.";
    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) e.image = "Only images allowed.";
      if (imageFile.size > 10 * 1024 * 1024) e.image = "Image must be smaller than 10MB.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleFileSelect(files) {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Only images allowed" }));
      return;
    }

    setErrors((p) => ({ ...p, image: undefined }));
    try {
      const compressed = await compressImage(f, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.78,
      });
      setImageFile(compressed);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch {
      setImageFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  }

  function removeImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
    setExistingImage(null);
    setErrors({});
  }

  function triggerFileInput() {
    if (fileRef.current) fileRef.current.click();
  }

  // 🔥 UPDATED SUBMIT FUNCTION (only URL change for edit mode)
  async function submit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setProgress(0);
    setToast({ type: "info", message: mode === "add" ? "Creating..." : "Updating..." });

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("slug", form.slug);
      fd.append("description", form.description || "");
      fd.append("price", String(form.price));
      if (form.category) fd.append("category", form.category);
      fd.append("available", form.available ? "true" : "false");
      fd.append("isVeg", form.isVeg ? "true" : "false");

      if (imageFile) fd.append("image", imageFile);

      let method = "post";
      let url = submitUrl;

      if (!url) {
        if (mode === "add") {
  // correct endpoint for creating a dish
  url = `/restaurants/${restaurantId}/menu`;
  method = "post";
}   else {
  // correct endpoint for editing a dish
   url = `/restaurants/${restaurantId}/dish/${dishId}`;
   method = "put";
}

      }

      const res = await axiosClient({
        url,
        method,
        data: fd,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / (p.total || 1));
          setProgress(percent);
        },
        timeout: 120000,
      });

      if (autosaveKey) localStorage.removeItem(autosaveKey);

      setToast({
        type: "success",
        message: mode === "add" ? "Dish created" : "Dish updated",
      });

      return res.data;
    } catch (err) {
      console.error("submit error", err);
      const msg = err?.response?.data?.message || err.message || "Save failed";
      setToast({ type: "error", message: msg });
      setErrors((p) => ({ ...p, submit: msg }));
      throw err;
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  }

  return (
    <div>
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

      <form onSubmit={submit}>
        {/* BASIC DETAILS */}
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Dish Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Dish Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm"
                autoFocus
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Price (₹)</label>
              <input
                name="price"
                value={form.price}
                onChange={onChange}
                type="number"
                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm"
              />
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm cursor-pointer"
              >
                <option value="">Choose category</option>
                {categories.map((c, idx) => (
                  <option key={idx} value={c._id ?? c.id ?? c}>
                    {c.name ?? c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-zinc-400 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows="3"
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm resize-none"
            />
          </div>
        </div>

        {/* IMAGE */}
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-4">Dish Image</h2>

          <div>
            {!previewUrl && !existingImage ? (
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-700"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <p className="text-white text-sm mb-1">Drag & drop or click to upload</p>
                <p className="text-zinc-500 text-xs">Max size: 5MB</p>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={previewUrl || existingImage}
                  alt="dish"
                  className="w-full max-w-sm h-48 object-cover rounded-lg border border-zinc-800"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full"
                >
                  ✕
                </button>
                {submitting && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                    <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            )}

            {errors.image && <p className="text-xs text-red-400 mt-2">{errors.image}</p>}
          </div>
        </div>

        {/* TOGGLES */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="available" checked={form.available} onChange={onChange} className="sr-only" />
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.available ? "bg-blue-600" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                    form.available ? "translate-x-5" : ""
                  }`}
                />
              </div>
              <span className="text-sm text-zinc-300">Available</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={onChange} className="sr-only" />
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.isVeg ? "bg-green-600" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                    form.isVeg ? "translate-x-5" : ""
                  }`}
                />
              </div>
              <span className="text-sm text-zinc-300">Vegetarian</span>
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="p-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {mode === "add" ? "Saving..." : "Updating..."}
              </>
            ) : mode === "add" ? (
              "Save Dish"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {errors.submit && <div className="p-4 text-red-400">{errors.submit}</div>}
      </form>
    </div>
  );
}

function makeSlug(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
