import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

const AdminProductForm = ({ productId, onSuccess }) => {
  const navigate = useNavigate();
  const isEdit = !!productId;

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    images: [""],
    variants: [{ size: "", color: "", storage: "" }],
    description: "",
    category: "",
  });

  // Fetch product if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        setForm({
          name: data.name || "",
          brand: data.brand || "",
          price: data.price || "",
          discount: data.discount || "",
          stock: data.stock || "",
          images: data.images.length ? data.images : [""],
          variants: data.variants.length
            ? data.variants
            : [{ size: "", color: "", storage: "" }],
          description: data.description || "",
          category: data.category || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load product data");
        navigate("/admin");
      }
    };

    fetchProduct();
  }, [isEdit, productId, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });

  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const addVariantField = () =>
    setForm({
      ...form,
      variants: [...form.variants, { size: "", color: "", storage: "" }],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/products/${productId}`, form);
        toast.success("✅ Product updated successfully!");
      } else {
        await api.post("/products", form);
        toast.success("✅ Product added successfully!");
      }
      onSuccess?.();
      setForm({
        name: "",
        brand: "",
        price: "",
        discount: "",
        stock: "",
        images: [""],
        variants: [{ size: "", color: "", storage: "" }],
        description: "",
        category: "",
      });
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-2xl rounded-2xl mb-8 transform transition-all duration-500 hover:scale-[1.01]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-gradient bg-clip-text text-transparent from-blue-500 to-indigo-600">
        {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div className="relative">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder=" "
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
            required
          />
          <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-500 peer-focus:text-sm">
            Product Name
          </label>
        </div>

        {/* Brand */}
        <div className="relative">
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder=" "
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 peer"
          />
          <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-indigo-500 peer-focus:text-sm">
            Brand
          </label>
        </div>

        {/* Price, Discount, Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["price", "discount", "stock"].map((field, idx) => (
            <div key={idx} className="relative">
              <input
                type="number"
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder=" "
                className={`w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 peer ${
                  field === "price"
                    ? "focus:ring-green-500"
                    : field === "discount"
                    ? "focus:ring-pink-500"
                    : "focus:ring-yellow-500"
                }`}
                required={field === "price"}
              />
              <label className={`absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-${
                field === "price"
                  ? "green-500"
                  : field === "discount"
                  ? "pink-500"
                  : "yellow-500"
              } peer-focus:text-sm capitalize`}>
                {field === "stock" ? "Stock Quantity" : field}
              </label>
            </div>
          ))}
        </div>

        {/* Images */}
        <div>
          <label className="font-semibold mb-2 inline-block">Images</label>
          {form.images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) => handleImageChange(i, e.target.value)}
              placeholder={`Image URL ${i + 1}`}
              className="w-full p-3 border border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
          >
            + Add Image
          </button>
        </div>

        {/* Variants */}
        <div>
          <label className="font-semibold mb-2 inline-block">Variants</label>
          {form.variants.map((variant, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
            >
              {["size", "color", "storage"].map((vfield, vi) => (
                <input
                  key={vi}
                  value={variant[vfield]}
                  onChange={(e) =>
                    handleVariantChange(i, vfield, e.target.value)
                  }
                  placeholder={vfield.charAt(0).toUpperCase() + vfield.slice(1)}
                  className={`p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    vfield === "size"
                      ? "focus:ring-blue-400"
                      : vfield === "color"
                      ? "focus:ring-pink-400"
                      : "focus:ring-green-400"
                  }`}
                />
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariantField}
            className="mt-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
          >
            + Add Variant
          </button>
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
        />

        {/* Category */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-2xl shadow-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
