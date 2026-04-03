import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { addToCart } from "../../utils/cart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Zap, Star, LayoutGrid } from "lucide-react";

export default function TopRated() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getProducts().then((res) => {
            const topOffers = res.data.filter((p) => p.isTopOffer === 1 && p.status === true);
            setProducts(topOffers);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-[#0166C7] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            {/* <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-[#0166C7]/10 rounded-2xl text-[#0166C7]">
                    <Star className="fill-[#0166C7]" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#112944] tracking-tight">Top Rated Deals</h2>
                  <p className="text-sm text-gray-400 font-medium mt-0.5 italic">"Handpicked quality with exclusive savings"</p>
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-100 to-transparent ml-4 rounded-full" />
            </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => {
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
                            className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer overflow-hidden group transition-all duration-500 flex flex-col"
                        >
                            {/* Signature Red & White Tag Concept Wrapped */}
                            <div className="absolute top-5 left-5 z-20 pointer-events-none scale-90 origin-top-left">
                                <div className="w-[140px] h-[35px] flex items-center overflow-hidden rounded-[8px] shadow-xl bg-transparent border-none group">
                                    <span className="w-[70%] h-full flex items-center justify-center gap-1 bg-[rgb(238,0,0)]">
                                        <svg className="fill-white h-[0.9em]" viewBox="0 0 512 512">
                                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                        </svg>
                                        <span className="text-white font-black text-[10px] uppercase tracking-tighter">Top Rated</span>
                                    </span>
                                    <span className="w-[30%] h-full flex items-center justify-center font-black text-[10px] text-[rgb(238,0,0)] bg-white relative">
                                        -{discountPercentage}%
                                        <span className="absolute w-2 h-2 bg-white rotate-45 -left-1" />
                                    </span>
                                </div>
                            </div>

                            {/* Product Image Section */}
                            <div className="h-48 w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                                <img
                                    src={`http://localhost:9999${p.image}`}
                                    alt={p.productName}
                                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Quick View Floating Icon */}
                                <div className="absolute inset-0 bg-[#112944]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                   <button 
                                      onClick={(e) => handleCart(e, p._id)}
                                      className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-[#112944] hover:bg-[#112944] hover:text-white transition-all transform scale-90 group-hover:scale-100"
                                    >
                                      <ShoppingCart size={18} />
                                   </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-bold text-[#112944] text-lg leading-tight truncate mb-3 group-hover:text-[#0166C7] transition-colors">
                                    {p.productName}
                                </h3>

                                {/* Price Container */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xl font-black text-[#0166C7]">
                                        ₹{p.discountPrice}
                                    </span>
                                    {p.price > p.discountPrice && (
                                        <span className="text-xs text-gray-400 line-through font-medium">
                                            ₹{p.price}
                                        </span>
                                    )}
                                </div>

                                {/* Divider & Actions */}
                                <div className="mt-auto pt-5 border-t border-gray-50 flex gap-3">
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
        </div>
    );
}
