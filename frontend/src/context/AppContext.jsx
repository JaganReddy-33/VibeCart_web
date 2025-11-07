import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User state: token, isAdmin, name, email
  const [user, setUser] = useState({
    token: localStorage.getItem("token") || null,
    isAdmin: localStorage.getItem("isAdmin") === "true" || false,
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
  });

  // Cart is per user
  const [cart, setCart] = useState(() => {
    const email = localStorage.getItem("email");
    return email ? JSON.parse(localStorage.getItem(email + "_cart")) || [] : [];
  });

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (user.email) {
      localStorage.setItem(user.email + "_cart", JSON.stringify(cart));
    }
  }, [cart, user.email]);

  // Login
  const login = (token, isAdmin, name, email) => {
    setUser({ token, isAdmin, name, email });
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);

    // Load cart for this user
    const userCart = JSON.parse(localStorage.getItem(email + "_cart")) || [];
    setCart(userCart);

    toast.success(`✅ Welcome ${name}`);
  };

  // Logout
  const logout = () => {
    setUser({ token: null, isAdmin: false, name: "", email: "" });
    setCart([]);
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    toast.success("🚪 Logged out");
  };

  // Cart functions
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        toast.success("Quantity updated 🛒");
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        toast.success("Added to cart 🛍️");
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p._id !== productId));
    toast.success("❌ Item removed");
  };

  const updateCartQty = (productId, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, qty } : p))
    );
  };

  const clearCart = () => {
    setCart([]);
    if (user.email) {
      localStorage.removeItem(user.email + "_cart");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
