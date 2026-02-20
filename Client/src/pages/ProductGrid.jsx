import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { addToCart } from "../utils/cart";
import { LiaCartArrowDownSolid } from "react-icons/lia";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const handleCart = async (e, id) => {
    e.stopPropagation();
    try {
      await addToCart(id);
      alert("Added to cart");
    } catch {
      navigate("/login");
    }
  };

  // Pagination calculation
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((p) => {
          const slug = p.productName.toLowerCase().replace(/\s+/g, "-");
          const discountPercentage = Math.round(
            ((p.price - p.discountPrice) / p.price) * 100
          );

          return (
            <div
              key={p._id}
              onClick={() => navigate(`/product-detail/${p._id}/${slug}`)}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden group transition"
            >
              {/* Top Offer Badge */}
              {p.isTopOffer === 1 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  Top Offer
                </span>
              )}

              {/* Cart Button */}
              <button
                onClick={(e) => handleCart(e, p._id)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition z-10"
              >
<LiaCartArrowDownSolid className="text-2xl" />
              </button>

              {/* Product Image */}
              <img
                src={`http://localhost:9999${p.image}`}
                alt={p.productName}
                className="h-48 w-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Product Info */}
              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-semibold text-gray-800 truncate">{p.productName}</h3>

                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">₹{p.discountPrice}</span>
                  {p.price > p.discountPrice && (
                    <>
                      <span className="text-gray-400 line-through text-sm">₹{p.price}</span>
                      <span className="text-red-500 text-xs font-semibold">-{discountPercentage}%</span>
                    </>
                  )}
                </div>

                {/* Stock */}
                <span
                  className={`text-xs font-medium ${
                    p.stockQuantity > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : "Out of stock"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === idx + 1
                  ? "bg-[#0F2640] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
