import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import { addToCart } from "../utils/cart";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ShoppingCart, Zap, Heart, Share2, 
  ChevronRight, ArrowLeft, ShieldCheck, Truck, RotateCcw, 
  Info, CheckCircle2, ShoppingBag 
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(res => {
        setProduct(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    setAddingToCart(true);
    try {
      await addToCart(id);
      // Optional: Add a toast notification here
      alert("Added to cart successfully!");
    } catch {
      navigate("/login");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <ShoppingBag className="w-10 h-10 text-[#0166C7]" />
        </motion.div>
      </div>
    );
  }

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Info className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-[#112944]">Product Not Found</h2>
      <button 
        onClick={() => navigate("/")}
        className="mt-4 text-[#0166C7] font-semibold hover:underline flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Back to Search
      </button>
    </div>
  );

  // Fallback for gallery if product doesn't have multiple images
  const galleryImages = [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-white font-['Inter',_sans-serif]">
      {/* HEADER NAV */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 flex items-center gap-2 text-sm text-gray-500">
        <button onClick={() => navigate("/")} className="hover:text-[#0166C7] transition-colors">Home</button>
        <ChevronRight size={14} />
        <span className="truncate max-w-[200px]">{product.productName}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: IMAGE GALLERY */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative group overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 aspect-square shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  src={`http://localhost:9999${galleryImages[activeImage]}`}
                  className="w-full h-full object-contain p-6 transform transition-transform group-hover:scale-105"
                  alt={product.productName}
                />
              </AnimatePresence>
              
              <div className="absolute top-6 right-6 space-y-3">
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-[#0166C7] transition-colors"
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>

            <div className="flex gap-4 px-2 overflow-x-auto py-2 scroll-smooth no-scrollbar">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl border-2 cursor-pointer p-1 bg-white flex-shrink-0 transition-all ${
                    activeImage === i ? "border-[#0166C7] shadow-lg shadow-blue-500/10" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <img
                    src={`http://localhost:9999${img}`}
                    className="w-full h-full object-contain"
                    alt={`${product.productName} thumbnail ${i}`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: DETAILS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="mb-2">
              <span className="bg-[#0166C7]/10 text-[#0166C7] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Professional Choice
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-[#112944] leading-tight mb-4">
              {product.productName}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-500 px-3 py-1 rounded-xl font-bold">
                <Star size={16} className="fill-yellow-500" />
                <span>4.2</span>
              </div>
              <span className="text-gray-400 font-medium">1,248 Verified Reviews</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-green-600 font-bold">In Stock</span>
            </div>

            <div className="bg-[#112944]/5 p-6 rounded-3xl mb-8 border border-[#112944]/10">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-[#0166C7]">
                  ₹{product.discountPrice}
                </span>
                <span className="text-xl text-gray-400 line-through mb-1">
                  ₹{product.price}
                </span>
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-1 ml-2">
                  -{Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-2">
                <Info size={14} className="text-[#0166C7]" />
                Tax inclusive. Best price guaranteed for today.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: Truck, text: "Free Fast Delivery", sub: "Delivery Tomorrow" },
                { icon: RotateCcw, text: "7 Days Returns", sub: "Hassle-free policy" },
                { icon: ShieldCheck, text: "1 Year Warranty", sub: "Brand Protection" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-3 rounded-2xl bg-gray-50 border border-gray-100 group transition-colors hover:bg-white hover:shadow-md">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0166C7] mb-2 shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-[#112944] uppercase tracking-tighter mb-0.5">{item.text}</span>
                  <span className="text-[10px] text-gray-400 leading-none">{item.sub}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={addingToCart}
                className={`flex-1 py-4.5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all ${
                  addingToCart ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#112944] text-white hover:bg-[#0a1b2d] shadow-[#112944]/20"
                }`}
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/checkout/${product._id}`)}
                className="flex-[1.5] py-4.5 bg-gradient-to-r from-[#0166C7] to-[#004ca0] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 transition-all"
              >
                <Zap size={22} strokeWidth={2.5} className="fill-white" />
                <span>BUY NOW</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM SECTION: TABS / DESCRIPTION */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#112944] mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-[#0166C7] rounded-full"></span>
                Product Intel & Details
              </h2>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
                <p>
                  {product.description || "Experience uncompromising quality with this premium product. Engineered for high performance and durability, it seamlessly blends modern aesthetics with state-of-the-art technology to deliver an exceptional user experience that stays ahead of the curve."}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {[
                    "Unmatched durability and build quality",
                    "Latest 2026 iteration technology",
                    "Eco-friendly manufacturing process",
                    "Ergonomic design for maximum comfort"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                      <span className="text-sm font-medium text-[#112944]">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 h-fit sticky top-8">
              <h3 className="text-xl font-bold text-[#112944] mb-6">Expert Highlights</h3>
              <div className="space-y-6">
                {[
                  { label: "Material", value: "Premium Grade Industrial" },
                  { label: "Warranty", value: "12 Months International" },
                  { label: "Category", value: product.category || "General" },
                  { label: "Unit ID", value: "#VM-"+id.substring(0,6).toUpperCase() }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-gray-500 font-medium">{row.label}</span>
                    <span className="text-sm text-[#112944] font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-[11px] text-gray-400 italic text-center">
                  "One of the top-rated items in our collection this season. Recommended for durability."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
