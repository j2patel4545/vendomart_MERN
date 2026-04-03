import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { addToCart } from "../../utils/cart";
import { ShoppingCart, Zap, Star, Info } from "lucide-react";
import { motion } from "framer-motion";

const TypeOfProduct = () => {
  const { productTypeName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [productTypeName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();

      const filteredProducts = res.data.filter(
        (item) =>
          item.productTypeId?.productTypeName?.toLowerCase() ===
          productTypeName.toLowerCase()
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    setAddingId(productId);
    try {
      await addToCart(productId);
      alert("Added to cart!");
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

  const handleBuyNow = (e, productId) => {
    e.stopPropagation();
    navigate(`/checkout/${productId}`);
  };

  if (loading) {
    return (
      <div className="h-[40vh] flex items-center justify-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0166C7]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#112944] capitalize tracking-tight">
            Explore {productTypeName}
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Top picks handpicked just for you.</p>
        </div>
        <div className="h-1 flex-1 mx-8 bg-gray-50 rounded-full" />
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
          <Info className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500 font-bold">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => {
            const productSlug = item.productName.toLowerCase().replace(/\s+/g, "-");
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/product-detail/${item._id}/${productSlug}`)}
                className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 p-6">
                  <img
                    src={`http://localhost:9999${item.image}`}
                    alt={item.productName}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gray-100 shadow-sm flex items-center gap-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-black text-[#112944]">4.9</span>
                  </div>

                  {/* Quick Actions Hover Over */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button 
                       onClick={(e) => handleAddToCart(e, item._id)}
                       className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#112944] hover:bg-[#112944] hover:text-white transition-all shadow-xl"
                       title="Add to Cart"
                     >
                       <ShoppingCart size={18} />
                     </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#112944] text-lg leading-tight line-clamp-1 mb-2 group-hover:text-[#0166C7] transition-colors">
                      {item.productName}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-black text-[#0166C7]">
                        ₹{item.discountPrice}
                      </span>
                      <span className="text-sm text-gray-400 line-through font-medium">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, item._id)}
                      disabled={addingId === item._id}
                      className="flex-1 py-3 px-4 bg-gray-50 text-[#112944] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ShoppingCart size={14} />
                      {addingId === item._id ? "..." : "Add"}
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, item._id)}
                      className="flex-1 py-3 px-4 bg-[#112944] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#112944]/20"
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
      )}
    </div>
  );
};

export default TypeOfProduct;
