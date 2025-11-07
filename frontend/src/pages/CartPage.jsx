import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateCartQty } = useContext(AppContext);
  const navigate = useNavigate();

  const formatINR = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="pt-12 text-2xl sm:text-3xl font-bold text-gray-700 mb-2 animate-fadeIn">
          🛒 Your Cart is Empty
        </h2>
        <p className="text-gray-500 animate-fadeIn delay-100">
          Looks like you haven’t added anything yet.
        </p>
      </div>
    );
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      <h2 className="pt-12 text-2xl sm:text-3xl font-bold mb-6 animate-fadeInUp">
        🛍️ Your Shopping Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col sm:flex-row items-center sm:justify-between border rounded-2xl p-4 shadow-md bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 animate-fadeInUp"
            >
              {/* Image */}
              <img
                src={item.images?.[0] || "/placeholder.png"}
                alt={item.name}
                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl mb-3 sm:mb-0 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => navigate(`/product/${item._id}`)}
              />

              {/* Details */}
              <div className="flex-1 sm:ml-6 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                  {item.name}
                </h3>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 shadow-md transition duration-200"
                    onClick={() => {
                      if (item.qty > 1) {
                        updateCartQty(item._id, item.qty - 1);
                        toast.success("➖ Quantity decreased");
                      }
                    }}
                  >
                    -
                  </button>
                  <span className="px-4 font-semibold">{item.qty}</span>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 shadow-md transition duration-200"
                    onClick={() => {
                      updateCartQty(item._id, item.qty + 1);
                      toast.success("➕ Quantity increased");
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <p className="text-green-600 font-bold mt-3 text-lg">
                  {formatINR(item.price * item.qty)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-2xl font-medium shadow-md transition-transform duration-200 transform hover:scale-105"
                onClick={() => {
                  removeFromCart(item._id);
                  toast.success("❌ Item removed");
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border rounded-2xl p-6 shadow-md bg-white h-fit animate-fadeInUp">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Items ({cart.length})</span>
            <span>{formatINR(total)}</span>
          </div>
          <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 mb-4">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
