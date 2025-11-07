import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Sync page & search from URL when component loads
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryPage = parseInt(queryParams.get("page")) || 1;
    const querySearch = queryParams.get("search") || "";
    setPage(queryPage);
    setSearch(querySearch);
  }, [location.search]);

  const fetchProducts = async (activePage, activeSearch) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/products?search=${activeSearch}&page=${activePage}&limit=12`
      );
      setProducts(data.products);
      setPages(data.pages);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page !== null) fetchProducts(page, search);
  }, [page, search]);

  useLayoutEffect(() => {
    if (location.state?.fromProductId && window.productRefs) {
      const productEl = window.productRefs[location.state.fromProductId];
      if (productEl) {
        productEl.scrollIntoView({ behavior: "smooth", block: "center" });
        navigate(location.pathname + location.search, { replace: true });
      }
    }
  }, [products, location.state, navigate, location.pathname, location.search]);


  const handlePageChange = (newPage) => {
    navigate(`/?search=${search}&page=${newPage}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">

      {/* Products Grid */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg animate-fadeIn">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="relative animate-fadeInUp hover:scale-105 transform transition-all duration-300">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg text-gray-700 hover:from-gray-400 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          ⬅️ Prev
        </button>
        <span className="font-semibold text-gray-700 px-2 py-1 rounded-lg bg-gray-100 shadow-sm">
          Page {page} of {pages}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(page + 1, pages))}
          disabled={page === pages}
          className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg text-gray-700 hover:from-gray-400 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default Home;
