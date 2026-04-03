import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, ShieldCheck, MapPin, Phone, User, 
  ChevronRight, CreditCard, ShoppingBag, CheckCircle2, 
  ArrowLeft, Loader2, AlertCircle 
} from "lucide-react";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    fullAddress: "",
  });

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.placeholder.replace(" ", "").toLowerCase()]: e.target.value });
  };

  // Specific mapping for placeholders to state keys
  const updateAddress = (key, value) => {
    setAddress(prev => ({ ...prev, [key]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!address.fullName || !address.mobile || !address.fullAddress || !address.city || !address.pincode) {
      setError("Please fill in all required delivery details.");
      return;
    }

    setOrdering(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return navigate("/login");

      const orderData = {
        productId: id,
        userId: user._id, // Send userId explicitly
        quantity,
        totalPrice: product.discountPrice * quantity,
        address
      };

      await axios.post(
        "http://localhost:9999/api/orders", 
        orderData
      );

      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#0166C7] animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const totalPrice = product.discountPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_sans-serif]">
      {/* HEADER NAV */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <button onClick={() => navigate("/")} className="hover:text-[#0166C7]">Home</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate(-1)} className="hover:text-[#0166C7]">Product</button>
            <ChevronRight size={14} />
            <span className="text-[#112944] font-bold">Secure Checkout</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase">
              <ShieldCheck size={16} /> 100% Secure
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-2xl text-center border border-gray-100"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-[#112944] mb-4">Order Placed!</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Thank you for your purchase! Your order has been placed successfully and is being processed. 
                You will be redirected shortly.
              </p>
              <button 
                onClick={() => navigate("/")}
                className="w-full py-4 bg-[#112944] text-white rounded-2xl font-bold hover:bg-[#0a1b2d] transition-all"
              >
                Back to Shopping
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* LEFT – Address */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 space-y-8"
              >
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#0166C7]/10 text-[#0166C7] rounded-xl flex items-center justify-center">
                      <MapPin size={22} />
                    </div>
                    <h2 className="text-2xl font-black text-[#112944]">Delivery Destination</h2>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center gap-3"
                      >
                        <AlertCircle className="text-red-500" size={18} />
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#112944] uppercase ml-1">Full Name *</label>
                      <input 
                        placeholder="e.g. John Doe" 
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] transition-all"
                        value={address.fullName}
                        onChange={(e) => updateAddress("fullName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#112944] uppercase ml-1">Mobile Number *</label>
                      <input 
                        placeholder="e.g. 9876543210" 
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] transition-all"
                        value={address.mobile}
                        onChange={(e) => updateAddress("mobile", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#112944] uppercase ml-1">City *</label>
                      <input 
                        placeholder="e.g. Mumbai" 
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] transition-all"
                        value={address.city}
                        onChange={(e) => updateAddress("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#112944] uppercase ml-1">State *</label>
                      <input 
                        placeholder="e.g. Maharashtra" 
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] transition-all"
                        value={address.state}
                        onChange={(e) => updateAddress("state", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#112944] uppercase ml-1">Pincode *</label>
                      <input 
                        placeholder="e.g. 400001" 
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] transition-all"
                        value={address.pincode}
                        onChange={(e) => updateAddress("pincode", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#112944] uppercase ml-1">Landmark</label>
                      <input 
                        placeholder="e.g. Near Mall" 
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] transition-all"
                        value={address.landmark}
                        onChange={(e) => updateAddress("landmark", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <label className="text-xs font-bold text-[#112944] uppercase ml-1">Full Address *</label>
                    <textarea
                      placeholder="e.g. Flat No, Wing, Housing Society Name, Street"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] transition-all h-28 resize-none"
                      value={address.fullAddress}
                      onChange={(e) => updateAddress("fullAddress", e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-[#112944] text-white p-8 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Truck className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">Standard Delivery</h4>
                      <p className="text-white/60 text-xs">Estimated arrival by Wednesday, Apr 10</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Free</span>
                </div>
              </motion.div>

              {/* RIGHT – Order Summary */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit sticky top-24">
                  <h2 className="text-xl font-black text-[#112944] mb-8">Purchase Summary</h2>

                  <div className="flex gap-4 mb-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 animate-pulse border border-gray-100 overflow-hidden">
                      <img
                        src={`http://localhost:9999${product.image}`}
                        alt={product.productName}
                        className="w-full h-full object-contain p-2"
                        onLoad={(e) => e.target.parentElement.classList.remove("animate-pulse")}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#112944] truncate text-sm">{product.productName}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        Professional Edition • Top Grade
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-[#112944] hover:bg-gray-50 active:scale-95 transition-all"
                        >
                          −
                        </button>
                        <span className="font-black text-[#112944] w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-[#112944] hover:bg-gray-50 active:scale-95 transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-medium">Subtotal</span>
                      <span className="text-[#112944] font-bold">₹{product.discountPrice * quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-medium">Shipping</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-medium">Tax</span>
                      <span className="text-[#112944] font-bold">Included</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-end">
                      <span className="text-[#112944] font-black text-lg">Total Amount</span>
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#0166C7]">₹{totalPrice}</div>
                        <div className="text-[10px] text-green-500 font-bold uppercase tracking-wider">You save ₹{(product.price - product.discountPrice) * quantity}</div>
                      </div>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={ordering}
                    className={`w-full mt-8 py-4.5 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
                      ordering ? "bg-gray-200 cursor-not-allowed" : "bg-[#0166C7] hover:bg-[#005bb8] shadow-blue-500/30"
                    }`}
                  >
                    {ordering ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={22} />
                        <span>Place Order</span>
                      </>
                    )}
                  </motion.button>
                  
                  <p className="text-[10px] text-center text-gray-400 mt-6 font-medium">
                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

                <div className="p-2 flex items-center justify-center gap-6 grayscale opacity-30">
                  <ShoppingBag size={24} />
                  <CreditCard size={24} />
                  <Truck size={24} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
