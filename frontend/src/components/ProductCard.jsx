import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    if (!window.productRefs) window.productRefs = {};
    window.productRefs[product._id] = cardRef.current;

    return () => {
      if (window.productRefs) delete window.productRefs[product._id];
    };
  }, [product._id]);

  const discountedPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  const formatINR = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const goToProduct = () => {
    navigate(`/product/${product._id}`, {
      state: { fromProductId: product._id },
    });
  };


  return (
    <div
      ref={cardRef}
      className="group relative bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Product Image */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={goToProduct}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
        </div>

        {/* Price Section */}
        <div className="flex flex-wrap items-baseline justify-between mt-auto gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {formatINR(discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span className="ml-1 sm:ml-2 line-through text-gray-400 text-xs sm:text-sm">
                {formatINR(product.price)}
              </span>
            )}
          </div>

          <div className="mt-2">
            <button
            onClick={goToProduct}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md transition-all w-full"
          >
            View
          </button>
          </div>
        </div>
      </div>

      {/* Subtle Glow Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
