import { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const API_PRODUCT = "http://localhost:9999/api/product-master";
const API_CART = "http://localhost:9999/api/cart-master";

export default function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadCart();
  }, []);

  const loadCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    const items = await Promise.all(
      localCart.map(async (c) => {
        const res = await axios.get(`${API_PRODUCT}/${c.productId}`);
        return {
          ...res.data,
          quantity: c.quantity,
        };
      })
    );

    setCartItems(items);
  };

  const updateQuantity = async (productId, qty) => {
    if (qty < 1) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.map(i =>
      i.productId === productId ? { ...i, quantity: qty } : i
    );

    localStorage.setItem("cart", JSON.stringify(cart));

    await axios.post(API_CART, {
      userId: user._id,
      productId,
      quantity: qty,
    });

    loadCart();
  };

  const removeItem = (productId) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(i => i.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  };

  const total = cartItems.reduce(
    (sum, i) => sum + i.discountPrice * i.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div
                key={item._id}
                className="flex gap-4 bg-white p-4 rounded-2xl shadow"
              >
                <img
                  src={`http://localhost:9999${item.image}`}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-semibold">{item.productName}</h2>
                  <p className="text-sm text-gray-500">
                    {item.productTypeId?.productTypeName}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="px-3 py-1 border rounded-lg"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="px-3 py-1 border rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ₹{item.discountPrice * item.quantity}
                  </p>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-2xl shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Price Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-green-600">₹{total}</span>
            </div>

            <button
              onClick={() => navigate(`/checkout/${cartItems[0]._id}`)}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
