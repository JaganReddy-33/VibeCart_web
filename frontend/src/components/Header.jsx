import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, User } from "lucide-react";

const Header = () => {
  const { user, logout, cart } = useContext(AppContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/?search=${searchQuery}&page=1`);
    setSearchQuery("");
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 backdrop-blur-md transition-all duration-300 ${isScrolled ? "bg-blue-600/90 h-16 shadow-lg" : "bg-blue-600 h-20"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className={`text-white font-bold text-xl sm:text-2xl md:text-3xl transition-transform duration-300 ${isScrolled ? "scale-95" : "scale-100"}`}>
          VibeCart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center flex-1 justify-end gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-full outline-none border border-white/20 text-gray-800 min-w-[200px]"
            />
            {/* <button type="submit" className="bg-yellow-400 text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-yellow-500 transition-all shadow-md flex items-center justify-center">
              <Search size={18} />
            </button> */}
          </form>

          {/* User Links */}
          {user.token ? (
            <div className="flex items-center gap-3">
              {!user.isAdmin && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
                  <User size={20} className="text-white" />
                  <span className="text-white font-medium">Hello, {user.name}</span>
                </div>
              )}
              {user.isAdmin && (
                <Link to="/admin" className="bg-white/20 px-3 py-1 rounded-full text-white font-medium hover:bg-white/30 transition">
                  Admin
                </Link>
              )}
              <Link to="/cart" className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
                <ShoppingCart size={20} className="text-white" />
                <span className="text-white font-medium">{cart.length}</span>
              </Link>
              <button onClick={logout} className="bg-yellow-400 text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-yellow-500 transition-all shadow-md">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="bg-yellow-400 text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-yellow-500 transition-all shadow-md">
                Login
              </Link>
              <Link to="/cart" className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
                <ShoppingCart size={20} className="text-white" />
                <span className="text-white font-medium">{cart.length}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="p-2 bg-yellow-400 rounded-full focus:outline-none">
            <Search size={20} className="text-blue-700" />
          </button>
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {mobileSearchOpen && (
        <div className="md:hidden w-full px-4 py-2 bg-blue-600/90 flex justify-center animate-slideDown">
          <form onSubmit={handleSearch} className="flex w-full gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full outline-none border border-white/20 text-gray-800"
            />
            {/* <button type="submit" className="bg-yellow-400 text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-yellow-500 transition-all shadow-md flex items-center justify-center">
              <Search size={18} />
            </button> */}
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700/95 text-white flex flex-col items-center gap-3 py-4 animate-slideDown backdrop-blur-md">
          {user.token ? (
            <>
              {!user.isAdmin && (
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full w-full justify-center">
                  <User size={20} className="text-white" />
                  <span className="text-white font-medium">Hello, {user.name}</span>
                </div>
              )}
              {user.isAdmin && (
                <Link to="/admin" className="hover:text-yellow-300 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/cart" className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full w-full justify-center hover:bg-white/30 transition" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={20} className="text-white" />
                <span className="text-white font-medium">{cart.length}</span>
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="bg-yellow-400 text-blue-700 font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 transition-all shadow-md w-full">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-yellow-400 text-blue-700 font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 transition-all shadow-md w-full text-center" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
