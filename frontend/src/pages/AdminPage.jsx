import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import AdminProductForm from "../components/AdminProductForm";

const AdminPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const productRefs = useRef({});

  const navigate = useNavigate();

  // Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await api.get("/admin");
        setAdminData(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Access denied");
      }
    };
    fetchAdmin();
  }, [navigate]);

  // Fetch products
  const fetchProducts = async (pageNum = 1) => {
    try {
      const res = await api.get(`/products?page=${pageNum}&limit=16`);
      const productList = Array.isArray(res.data) ? res.data : res.data.products;

      setProducts(productList || []);
      setPages(res.data.pages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleEditSuccess = () => {
    const editedId = editingProductId;
    setEditingProductId(null);
    fetchProducts(page).then(() => {
      if (productRefs.current[editedId]) {
        productRefs.current[editedId].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  // Lock scroll on modal
  useEffect(() => {
    document.body.style.overflow = editingProductId ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editingProductId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow-md animate-fadeIn">
          <h2 className="text-xl font-bold">⚠️ {error}</h2>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 animate-pulse">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="pt-8 text-3xl sm:text-4xl font-bold mb-4 animate-fadeIn">👑 Admin Dashboard</h1>
      <p className="mb-6 text-gray-700 text-sm sm:text-base">
        Welcome, <span className="font-semibold">{adminData.name}</span> ({adminData.email})
      </p>

      {/* Add Product Form */}
      <h2 className="text-2xl font-bold mb-4">➕ Add New Product</h2>
      <div className="animate-fadeInUp">
        <AdminProductForm onSuccess={() => fetchProducts(page)} />
      </div>

      {/* Products Grid */}
      <h2 className="text-2xl font-bold mt-8 mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              ref={(el) => (productRefs.current[product._id] = el)}
              className="group relative bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative cursor-pointer overflow-hidden">
                <img
                  src={product.images?.[0] || ""}
                  alt={product.name}
                  className="w-full h-48 sm:h-56 md:h-60 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
                  onClick={() => navigate(`/product/${product._id}`)}
                />

                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                <h2 className="font-bold mt-2 text-base sm:text-lg truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm truncate">
                  <span className="font-semibold">{product.brand}</span> • {product.description}
                </p>
                <p className="mt-1 font-bold text-lg">₹{product.price}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    onClick={() => setEditingProductId(product._id)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-full hover:bg-yellow-600 transition-colors duration-300 shadow-md transform hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await api.delete(`/products/${product._id}`);
                        toast.success("✅ Product deleted!");
                        fetchProducts(page);
                      } catch (err) {
                        toast.error(err.response?.data?.message || err.message);
                      }
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Subtle Glow Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products yet.</p>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center mt-6 gap-4 flex-wrap">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 transition-colors duration-300"
          >
            ⬅️ Prev
          </button>
          <span className="px-4 py-2 font-semibold">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 transition-colors duration-300"
          >
            Next ➡️
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fadeIn">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto animate-slideInUp">
            <button
              onClick={() => setEditingProductId(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">✏️ Edit Product</h2>
            <AdminProductForm
              productId={editingProductId}
              onSuccess={handleEditSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
