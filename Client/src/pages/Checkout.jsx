import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";

export default function Checkout() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductById(id).then(res => setProduct(res.data));
  }, [id]);

  if (!product)
    return <div className="text-center py-20">Loading...</div>;

  const totalPrice = product.discountPrice * quantity;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* LEFT – Address */}
      <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Full Name" className="input" />
          <input placeholder="Mobile Number" className="input" />
          <input placeholder="City" className="input" />
          <input placeholder="State" className="input" />
          <input placeholder="Pincode" className="input" />
          <input placeholder="Landmark" className="input" />
        </div>

        <textarea
          placeholder="Full Address"
          className="input mt-4 h-28 resize-none"
        />
      </div>

      {/* RIGHT – Order Summary */}
      <div className="bg-white p-6 rounded-2xl shadow h-fit">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

        <div className="flex gap-4 mb-4">
          <img
            src={`http://localhost:9999${product.image}`}
            alt={product.productName}
            className="w-20 h-20 object-cover rounded-xl"
          />

          <div>
            <h3 className="font-semibold">{product.productName}</h3>
            <p className="text-sm text-gray-500">
              {product.productTypeId?.productTypeName}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-1 border rounded-lg"
              >
                −
              </button>

              <span className="font-semibold">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between mb-2">
          <span>Price</span>
          <span>₹{product.discountPrice}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Quantity</span>
          <span>{quantity}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-green-600">₹{totalPrice}</span>
        </div>

        <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
          Place Order
        </button>
      </div>
    </div>
  );
}
