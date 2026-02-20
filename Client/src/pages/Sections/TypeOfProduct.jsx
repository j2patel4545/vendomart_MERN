import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { ShoppingCart } from "lucide-react";

const TypeOfProduct = () => {
  const { productTypeName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 capitalize">
        {productTypeName} Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition relative cursor-pointer"
              onClick={() => navigate(`/productsub/${item._id}`)}
            >
              <div className="h-48 overflow-hidden rounded-t-xl">
                <img
                  src={`http://localhost:9999${item.image}`}
                  alt={item.productName}
                  className="w-full h-full object-cover hover:scale-110 transition"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Add to cart clicked");
                }}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-orange-500 hover:text-white"
              >
                <ShoppingCart size={18} />
              </button>

              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-sm truncate">
                  {item.productName}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-orange-600 font-bold">
                    ₹{item.discountPrice}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ₹{item.price}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Stock: {item.stockQuantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeOfProduct;
