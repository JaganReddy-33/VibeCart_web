import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const ProductCart = ({ product }) => {
  const { addToCart } = useContext(AppContext);
  const [localStock, setLocalStock] = useState(product.stock);

  const handleAddToCart = () => {
    if (localStock === 0) {
      toast.error(`${product.name} is out of stock ❌`);
      return;
    }

    addToCart(product);
    setLocalStock(localStock - 1);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Product Price */}
      <p className="text-xl font-bold text-gray-800 transition-colors duration-300">
        ${product.price}
      </p>

      {/* Stock Info */}
      <p
        className={`text-sm font-medium ${
          localStock > 0 ? "text-green-600" : "text-red-500 animate-pulse"
        }`}
      >
        {localStock > 0 ? `Stock: ${localStock}` : "Out of stock"}
      </p>

      {/* Add to Cart Button */}
      <button
        className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
          localStock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 hover:scale-105 shadow-md hover:shadow-lg"
        }`}
        onClick={handleAddToCart}
        disabled={localStock === 0}
      >
        {localStock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCart;
