import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/users/register", { name, email, password });
      toast.success("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
      
      {/* Animated Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <span className="absolute w-96 h-96 bg-pink-300 rounded-full opacity-40 -top-32 -left-32 animate-blob animation-delay-2000"></span>
        <span className="absolute w-96 h-96 bg-purple-300 rounded-full opacity-40 -bottom-32 -right-32 animate-blob animation-delay-4000"></span>
        <span className="absolute w-96 h-96 bg-indigo-300 rounded-full opacity-40 top-1/2 left-1/2 animate-blob animation-delay-6000"></span>
        <span className="absolute w-96 h-96 bg-yellow-300 rounded-full opacity-30 -bottom-40 left-1/3 animate-blob animation-delay-5000"></span>
        <span className="absolute w-96 h-96 bg-green-300 rounded-full opacity-30 top-20 right-1/4 animate-blob animation-delay-7000"></span>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-10 z-10 animate-fadeInUp">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 animate-fadeInUp">
          Create Account
        </h2>

        {error && (
          <p className="text-center text-red-600 bg-red-100 p-2 rounded-lg mb-4 animate-fadeIn">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative animate-fadeInLeft">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow shadow-sm hover:shadow-md"
              required
            />
          </div>

          <div className="relative animate-fadeInRight">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow shadow-sm hover:shadow-md"
              required
            />
          </div>

          <div className="relative animate-fadeInLeft">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow shadow-sm hover:shadow-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white py-3 rounded-2xl shadow-lg font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-fadeInUp"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="border-b w-1/3 border-gray-300"></span>
          <span className="px-2 text-gray-400 text-sm">or</span>
          <span className="border-b w-1/3 border-gray-300"></span>
        </div>

        {/* Login Link */}
        <div className="text-center text-gray-700 space-y-2 animate-fadeInUp">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-medium hover:underline hover:text-purple-700 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-6000 { animation-delay: 6s; }
        .animation-delay-7000 { animation-delay: 7s; }

        @keyframes fadeInUp { 
          0% { opacity: 0; transform: translateY(20px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeInUp { animation: fadeInUp 1s ease forwards; }

        @keyframes fadeInLeft { 
          0% { opacity: 0; transform: translateX(-20px); } 
          100% { opacity: 1; transform: translateX(0); } 
        }
        .animate-fadeInLeft { animation: fadeInLeft 1s ease forwards; }

        @keyframes fadeInRight { 
          0% { opacity: 0; transform: translateX(20px); } 
          100% { opacity: 1; transform: translateX(0); } 
        }
        .animate-fadeInRight { animation: fadeInRight 1s ease forwards; }

        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
      `}</style>
    </div>
  );
};

export default Register;
