import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import { addToCart } from "../utils/cart";
import { Star } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then(res => setProduct(res.data));
  }, [id]);

  const handleAdd = async () => {
    try {
      await addToCart(id);
      alert("Added to cart");
    } catch {
      navigate("/login");
    }
  };

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT – IMAGE + GALLERY */}
        <div className="space-y-4">
          <img
            src={`http://localhost:9999${product.image}`}
            className="rounded-2xl border shadow-md"
            alt={product.productName}
          />

          <div className="flex gap-3">
            {[1, 2, 3, 4].map(i => (
              <img
                key={i}
                src={`http://localhost:9999${product.image}`}
                className="w-20 h-20 rounded-xl border cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        </div>

        {/* RIGHT – DETAILS */}
        <div className="space-y-6">

          <h1 className="text-3xl font-bold">
            {product.productName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[1,2,3,4].map(i => (
              <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-gray-500 text-sm">(4.2 • 1,248 ratings)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600">
              ₹{product.discountPrice}
            </span>
            <span className="line-through text-gray-400 text-lg">
              ₹{product.price}
            </span>
            <span className="text-sm text-green-700 font-semibold">
              20% OFF
            </span>
          </div>

          {/* Offers */}
          <div className="bg-green-50 border rounded-xl p-4 space-y-2">
            <p>💳 Bank Offer: 10% off on Credit Card</p>
            <p>🚚 Free Delivery by Tomorrow</p>
            <p>🔁 7 Days Replacement Policy</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAdd}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Add to Cart
            </button>

            <button className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-xl font-semibold">
              Buy Now
            </button>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="font-semibold mb-2">Highlights</h3>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              <li>High quality material</li>
              <li>Latest technology used</li>
              <li>1 Year Warranty</li>
              <li>Top brand trusted product</li>
            </ul>
          </div>

        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-14 bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <p className="text-gray-600 leading-relaxed">
          {product.description || "This is a premium quality product designed for everyday use. It delivers excellent performance and reliability with modern design and strong build quality."}
        </p>
      </div>
    </div>
  );
}
