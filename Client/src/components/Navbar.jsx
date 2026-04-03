import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Search, LogOut, ChevronDown, Bell, Package, CheckCircle, Truck } from "lucide-react";
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handleClick = () => {
      setUserMenuOpen(false);
      setNotificationsOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  /* Load notifications (Polling system) */
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      // Accessing with explicit userId as auth was removed from backend
      const res = await axios.get(`http://localhost:9999/api/orders/my-orders?userId=${user._id}`);
      const unread = res.data.filter(order => !order.isRead);
      setNotifications(res.data.slice(0, 5)); // Show latest 5
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // 10s poll
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:9999/api/orders/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

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
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img className="h-10 md:h-12 object-contain" src="/logo.png" alt="logo" />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative mx-8">
          <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-[#0166C7] focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands and more"
              className="bg-transparent outline-none px-3 w-full text-sm placeholder:text-gray-400"
            />
          </div>

          <AnimatePresence>
            {searchTerm && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[100]"
              >
                {searchLoading ? (
                  <div className="p-6 text-center text-gray-400">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                    <span className="text-xs font-semibold">Searching the shop...</span>
                  </div>
                ) : (
                  <>
                    {(searchResults.products.length > 0 || searchResults.productTypes.length > 0) ? (
                      <div className="max-h-[70vh] overflow-y-auto">
                        {searchResults.products.length > 0 && (
                          <div className="p-2">
                            <div className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50/50 rounded-lg mb-1">Products</div>
                            {searchResults.products.map((product) => {
                              const slug = product.productName.toLowerCase().replace(/\s+/g, "-");
                              return (
                                <Link
                                  key={product._id}
                                  to={`/product-detail/${product._id}/${slug}`}
                                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-xl group transition-all"
                                  onClick={() => setSearchTerm("")}
                                >
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                     <img src={`http://localhost:9999${product.image}`} alt="" className="w-full h-full object-contain p-1" />
                                  </div>
                                  <span className="text-sm font-bold text-gray-700 group-hover:text-[#0166C7]">{product.productName}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {searchResults.productTypes.length > 0 && (
                          <div className="p-2 border-t border-gray-50">
                            <div className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50/50 rounded-lg mb-1">Categories</div>
                            {searchResults.productTypes.map((type) => (
                              <Link
                                key={type._id}
                                to={`/product/${type.productTypeName}`}
                                className="block px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 hover:text-[#0166C7] transition-all"
                                onClick={() => setSearchTerm("")}
                              >
                                {type.productTypeName}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-400">
                         <div className="text-sm font-bold">No results found</div>
                         <p className="text-xs mt-1">Try a different keyword</p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {/* Notifications */}
          {user && (
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 text-gray-700 hover:text-[#0166C7] transition-colors"
                title="Recent Status Alerts"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden z-[110]"
                  >
                    <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Alerts</span>
                      {unreadCount > 0 && <span className="bg-blue-100 text-[#0166C7] text-[9px] px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((note) => {
                          const productSlug = note.productId?.productName?.toLowerCase().replace(/\s+/g, "-");
                          return (
                            <div 
                              key={note._id} 
                              onClick={() => {
                                markAsRead(note._id);
                                setNotificationsOpen(false);
                                if (note.productId?._id) {
                                  navigate(`/product-detail/${note.productId._id}/${productSlug}`);
                                }
                              }}
                              className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${!note.isRead ? "bg-blue-50/30" : ""}`}
                            >
                              {/* Product Image with Status Overlay */}
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <div className="w-full h-full rounded-xl bg-gray-50 border border-gray-100 overflow-hidden p-1">
                                  <img 
                                    src={`http://localhost:9999${note.productId?.image}`} 
                                    alt="" 
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-black ${
                                  note.status === "Delivered" ? "bg-green-500 text-white" : 
                                  note.status === "Shipped" ? "bg-blue-500 text-white" : "bg-amber-500 text-white"
                                }`}>
                                  {note.status === "Delivered" ? <CheckCircle size={10} /> : 
                                   note.status === "Shipped" ? <Truck size={10} /> : <Package size={10} />}
                                </div>
                              </div>
                              
                              <div className="min-w-0 flex-1">
                                <div className="text-[#112944] font-bold text-xs truncate">Order {note.status}</div>
                                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5 font-medium truncate">
                                  {note.productId?.productName}
                                </p>
                                <div className="text-[8px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                                  {new Date(note.updatedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-10 text-center text-gray-400">
                          <Bell className="mx-auto mb-2 opacity-10" size={32} />
                          <p className="text-[10px] font-medium">No new updates</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <Link to="/cart" className="relative group p-2">
            <ShoppingCart size={24} className="text-gray-700 group-hover:text-[#0166C7] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#0166C7] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-3 transition-all hover:opacity-80"
              >
                <div className="text-right hidden lg:block">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Hello,</div>
                  <div className="text-sm font-bold text-gray-700">{user.name.split(' ')[0]}</div>
                </div>
                <img
                  src={`http://localhost:9999${user.profileImage || "/default-user.png"}`}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-52 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden z-[110] p-2"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors"
                    >
                      <User size={18} /> Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors text-left"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-[#112944] text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg shadow-black/10"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button className="md:hidden p-2 text-gray-700" onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Primary Categories Navigation (Desktop) */}
      <div className="hidden md:flex justify-center border-t border-gray-50 bg-white/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
        <div className="flex gap-10 px-4">
          <Link to="/" className="py-3.5 text-xs font-black uppercase tracking-widest text-[#0166C7] border-b-2 border-[#0166C7]">Home</Link>
          {categories.map((item) => (
            <Link
              key={item._id}
              to={`/product/${item.productTypeName}`}
              className="py-3.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 border-b-2 border-transparent transition-all"
            >
              {item.productTypeName}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-[80%] max-w-xs bg-white p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <img src="/logo.png" alt="logo" className="h-8" />
                <button onClick={() => setOpen(false)} className="p-2 border rounded-full text-gray-400"><X size={20} /></button>
              </div>

              <div className="flex flex-col gap-6 text-sm font-bold">
                 <Link to="/" onClick={() => setOpen(false)} className="flex items-center justify-between text-gray-700">Home</Link>
                 <hr className="border-gray-50" />
                 {categories.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item.productTypeName}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-gray-500"
                  >
                    {item.productTypeName}
                  </Link>
                ))}
                <hr className="border-gray-50" />
                <Link to="/cart" onClick={() => setOpen(false)} className="text-gray-500">Cart ({cartCount})</Link>
                {user ? (
                   <button onClick={logout} className="text-red-500 text-left">Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)} className="text-[#0166C7]">Sign In</Link>
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
