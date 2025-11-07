import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import ImageGallery from "../components/ImageGallery";
import Reviews from "../components/Reviews";
import Loader from "../components/Loader";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.images[0] || "");
        const rev = await api.get(`/reviews/${id}`);
        setReviews(rev.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddReview = async (newReview) => {
    try {
      const res = await api.post(`/reviews/${id}`, newReview);
      setReviews([res.data, ...reviews]);
      toast.success("Review added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <Loader />;
  if (!product)
    return (
      <p className="pt-12 text-center text-red-500 mt-10 text-lg font-semibold animate-fadeIn">
        Product not found
      </p>
    );

  const discountedPrice =
    product.price - (product.price * (product.discount || 0)) / 100;
  const formatINR = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8 animate-fadeInUp">
        {/* IMAGE GALLERY */}
        <div className="pt-12 lg:w-1/2 flex flex-col gap-4">
          <ImageGallery
            images={product.images}
            mainImage={mainImage}
            setMainImage={setMainImage}
          />
        </div>

        {/* PRODUCT INFO */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="pt-12 text-3xl sm:text-4xl font-bold text-gray-900 animate-fadeInUp">
            {product.name}
          </h1>
          <p className="text-gray-700 text-sm sm:text-base animate-fadeInUp">
            <span className="font-semibold">{product.brand}</span> |{" "}
            {product.description}
          </p>

          {/* VARIANTS */}
          {product.variants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 animate-fadeIn">
              {product.variants.map((v, i) => (
                <span
                  key={i}
                  className="border px-3 py-1 rounded-full text-sm bg-gray-100 cursor-pointer hover:bg-blue-100 transition-colors duration-300"
                >
                  {v.size} | {v.color} | {v.storage}
                </span>
              ))}
            </div>
          )}

          {/* PRICES */}
          <div className="flex items-center gap-4 mb-2 animate-fadeInUp">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {formatINR(discountedPrice)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="line-through text-gray-400">
                  {formatINR(product.price)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm animate-pulse">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="text-gray-600 mb-2 animate-fadeIn">
            Stock: {product.stock}
          </div>

          {/* ADD TO CART / BUY BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 sticky top-4 z-20 bg-gray-50 p-3 rounded-lg shadow-md animate-fadeInUp">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
            >
              Add to Cart
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold shadow-lg transition-all transform hover:scale-105">
              Buy Now
            </button>
          </div>

          {/* REVIEWS */}
          <Reviews reviews={reviews} onAddReview={handleAddReview} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
