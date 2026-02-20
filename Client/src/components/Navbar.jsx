import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Heart, User, Search, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], productTypes: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* Close user dropdown on outside click */
  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  /* Load categories */
  useEffect(() => {
    axios
      .get("http://localhost:9999/api/product-type/")
      .then((res) => {
        setCategories(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* Load cart count */
  useEffect(() => {
    const interval = setInterval(() => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  /* Logout */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setCartCount(0);
    navigate("/");
  };

  /* Search */
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults({ products: [], productTypes: [] });
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setSearchLoading(true);
      axios
        .get(`http://localhost:9999/api/search?query=${searchTerm}`)
        .then((res) => setSearchResults(res.data))
        .catch(() => setSearchResults({ products: [], productTypes: [] }))
        .finally(() => setSearchLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <img className="h-12 object-contain" src="/logo.png" alt="logo" />
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 flex-col relative">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products or types"
              className="bg-transparent outline-none px-2 w-full text-sm"
            />
          </div>

          {searchTerm && (
            <div className="absolute top-full left-0 w-full bg-white border rounded shadow-md max-h-64 overflow-y-auto z-50">
              {searchLoading ? (
                <div className="p-3 text-gray-500">Searching...</div>
              ) : (
                <>
                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="px-3 py-1 font-semibold border-b">Products</div>
                      {searchResults.products.map((product) => {
                        const slug = product.productName.toLowerCase().replace(/\s+/g, "-");
                        return (
                          <Link
                            key={product._id}
                            to={`/product-detail/${product._id}/${slug}`}
                            className="block px-3 py-2 hover:bg-gray-100"
                            onClick={() => setSearchTerm("")}
                          >
                            {product.productName}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {searchResults.productTypes.length > 0 && (
                    <div>
                      <div className="px-3 py-1 font-semibold border-b">Categories</div>
                      {searchResults.productTypes.map((type) => (
                        <Link
                          key={type._id}
                          to={`/product/${type.productTypeName}`}
                          className="block px-3 py-2 hover:bg-gray-100"
                          onClick={() => setSearchTerm("")}
                        >
                          {type.productTypeName}
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length === 0 &&
                    searchResults.productTypes.length === 0 && (
                      <div className="p-3 text-gray-500">No results found</div>
                    )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/cart" className="relative flex flex-col items-center">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
            <span>Cart</span>
          </Link>

          <Link to="/wishlist" className="flex flex-col items-center">
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen((prev) => !prev);
                }}
                className="flex items-center gap-3"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>

                <img
                  src={`http://localhost:9999${user.profileImage || "/default-user.png"}`}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border border-zinc-400"
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-3 w-40 bg-white border rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      <User size={16} /> Profile
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm text-left text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="flex flex-col items-center">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden ml-auto" onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Categories Desktop */}
      <div className="hidden md:flex justify-center gap-8 text-sm font-medium border-t">
        {loading ? (
          <span className="py-3 text-gray-400">Loading...</span>
        ) : (
          categories.map((item) => (
            <Link
              key={item._id}
              to={`/product/${item.productTypeName}`}
              className="py-3 hover:text-blue-600"
            >
              {item.productTypeName}
            </Link>
          ))
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-72 bg-white p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <X onClick={() => setOpen(false)} />
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <Link to="/" onClick={() => setOpen(false)}>Home</Link>

                {categories.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item.productTypeName}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.productTypeName}
                  </Link>
                ))}

                <Link to="/cart">Cart</Link>

                {user ? (
                  <span onClick={logout} className="cursor-pointer">Logout</span>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
