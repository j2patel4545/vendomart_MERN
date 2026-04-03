import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { addToCart } from "../utils/cart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Zap, Star, ChevronLeft, ChevronRight, Info } from "lucide-react";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProducts().then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCart = async (e, id) => {
    e.stopPropagation();
    setAddingId(id);
    try {
      await addToCart(id);
      alert("Added to cart");
    } catch (err) {
      if (err.message === "NOT_LOGGED_IN") {
        navigate("/login");
      } else {
        alert("Failed to add to cart");
      }
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = (e, id) => {
    e.stopPropagation();
    navigate(`/checkout/${id}`);
  };

  // Pagination calculation
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-[#0166C7] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-white">
      {/* Grid Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#112944] tracking-tight">Our Collection</h2>
          <p className="text-gray-400 font-medium mt-2">Discover curated products for your lifestyle.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-xs font-black text-gray-300 uppercase tracking-widest">
             Page {currentPage} of {totalPages}
           </span>
           <div className="h-1 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((p) => {
          const slug = p.productName.toLowerCase().replace(/\s+/g, "-");
          const discountPercentage = Math.round(
            ((p.price - p.discountPrice) / p.price) * 100
          );

          return (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/product-detail/${p._id}/${slug}`)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer overflow-hidden group transition-all duration-500 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-gray-50 p-4">
                <img
                  src={`http://localhost:9999${p.image}`}
                  alt={p.productName}
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Sale Badge */}
                {p.price > p.discountPrice && (
                  <div className="absolute top-4 left-4 bg-[#0166C7] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                    -{discountPercentage}%
                  </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => handleCart(e, p._id)}
                      className="w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center text-[#112944] hover:bg-[#112944] hover:text-white transition-all transform scale-90 group-hover:scale-100"
                    >
                      <ShoppingCart size={20} />
                    </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[#112944] text-lg leading-snug mb-3 group-hover:text-[#0166C7] transition-colors truncate">
                  {p.productName}
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg font-black text-[#112944]">₹{p.discountPrice}</span>
                  {p.price > p.discountPrice && (
                    <span className="text-xs text-gray-400 line-through font-medium">₹{p.price}</span>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex gap-3">
                  <button
                    onClick={(e) => handleCart(e, p._id)}
                    disabled={addingId === p._id}
                    className="flex-1 py-3 bg-gray-50 text-[#112944] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart size={14} />
                    {addingId === p._id ? "..." : "Add"}
                  </button>
                  <button
                    onClick={(e) => handleBuyNow(e, p._id)}
                    className="flex-1 py-3 bg-[#112944] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#112944]/20"
                  >
                    <Zap size={14} className="fill-white" />
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modernized Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center mt-24 gap-6">
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-12 h-12 rounded-full font-black text-xs transition-all duration-300 ${
                    currentPage === idx + 1
                      ? "bg-[#112944] text-white shadow-lg shadow-[#112944]/30 scale-110"
                      : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-300">
            End of Collection
          </p>
        </div>
      )}
    </div>
  );
}
