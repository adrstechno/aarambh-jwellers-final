/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { getJewellerySection, updateJewellerySection } from "../../api/jewellerySectionApi";
import { X, CheckCircle, AlertCircle, Upload } from "lucide-react";

export default function JewellerySectionAdmin() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    tagline: "",
    description: "",
    button1Text: "",
    button1Link: "",
    button2Text: "",
    button2Link: "",
    mainImage: null,
    modelImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // ✅ Toast utility
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  // ✅ Load current jewellery section
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJewellerySection();
        setForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          tagline: data.tagline || "",
          description: data.description || "",
          button1Text: data.button1Text || "Shop Now",
          button1Link: data.button1Link || "/products",
          button2Text: data.button2Text || "View More",
          button2Link: data.button2Link || "/about",
        });
        setPreview({
          mainImage: data.mainImage ? `${BASE_URL}${data.mainImage}` : null,
          modelImage: data.modelImage ? `${BASE_URL}${data.modelImage}` : null,
        });
      } catch (err) {
        console.error("❌ Failed to load section:", err);
        showToast("error", "Failed to load jewellery section");
      }
    };
    fetchData();
  }, []);

  // ✅ Handle input fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      setPreview({
        ...preview,
        [name]: URL.createObjectURL(files[0]),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const data = await updateJewellerySection(formData);
      showToast("success", data.message || "Jewellery section updated!");
    } catch (err) {
      console.error("❌ Error saving section:", err);
      showToast("error", "Failed to update jewellery section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Jewellery Section Management</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Button 1 Text</label>
            <input
              type="text"
              name="button1Text"
              value={form.button1Text}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Button 1 Link</label>
            <input
              type="text"
              name="button1Link"
              value={form.button1Link}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Button 2 Text</label>
            <input
              type="text"
              name="button2Text"
              value={form.button2Text}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Button 2 Link</label>
            <input
              type="text"
              name="button2Link"
              value={form.button2Link}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Images */}
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Main Image</label>
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
            {preview?.mainImage && (
              <img
                src={preview.mainImage}
                alt="Main preview"
                className="mt-3 rounded-lg w-full h-48 object-cover"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Model Image</label>
            <input
              type="file"
              name="modelImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
            {preview?.modelImage && (
              <img
                src={preview.modelImage}
                alt="Model preview"
                className="mt-3 rounded-lg w-full h-48 object-cover"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition mt-6"
        >
          {loading ? "Saving..." : "Save Jewellery Section"}
        </button>
      </form>
    </div>
  );
}
