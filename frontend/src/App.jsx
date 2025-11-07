import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutPage from "./pages/CheckoutPage";
import AdminProductForm from "./components/AdminProductForm";
import { Toaster } from "react-hot-toast";

function AppWrapper() {
  const location = useLocation();
  
  // Pages where Header should NOT be visible
  const hideHeader = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <Toaster position="top-right" />
      {/* Only show Header if not login/register */}
      {!hideHeader && <Header />}

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/edit/:id" element={<AdminProductForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <h2 className="text-center mt-10 text-red-600 text-xl sm:text-2xl md:text-3xl">
                404 - Page Not Found
              </h2>
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
