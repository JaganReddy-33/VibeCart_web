import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";

function CheckoutPage() {
  const { cart, clearCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/checkout", {
        cartItems: cart,
        name: formData.name,
        email: formData.email,
      });

      if ((res.status === 200 || res.status === 201) && res.data.success) {
        setShowSuccess(true);
      } else {
        throw new Error(res.data?.message || "Checkout failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Checkout failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center p-10 animate-fadeIn">
        <h2 className="pt-12 text-2xl sm:text-3xl font-bold mb-4 text-gray-700">🛒 Your cart is empty</h2>
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          onClick={() => navigate("/cart")}
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/cart")}
        className="pt-12 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors animate-fadeIn"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cart
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 animate-fadeInUp">
        Checkout
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideInLeft">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-2 rounded animate-fadeIn">{error}</div>
          )}

          <form onSubmit={handleCheckout} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow shadow-sm hover:shadow-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Complete Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideInRight">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>

          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm sm:text-base animate-fadeIn">
                <span className="text-gray-600">{item.name} × {item.qty}</span>
                <span className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              <span>Total</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-scaleUp">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
            </div>

            <h2 className="text-2xl font-bold text-green-600 mb-3">🎉 Order Successful!</h2>
            <p className="text-gray-600 mb-4">Thank you for your purchase, <b>{formData.name}</b>!</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-bold text-blue-600">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Order Date:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              A confirmation email has been sent to <b>{formData.email}</b>.
            </p>

            <button
              onClick={() => {
                clearCart();
                localStorage.removeItem("cart");
                navigate("/");
              }}
              className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg transition-transform transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
