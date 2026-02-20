import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { addToCart } from "../../utils/cart";
import { LiaCartArrowDownSolid } from "react-icons/lia";



export default function TopRated() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then((res) => {
            const topOffers = res.data.filter((p) => p.isTopOffer === 1 && p.status === true);
            setProducts(topOffers);
        });
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

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
                const slug = p.productName.toLowerCase().replace(/\s+/g, "-");
                const discountPercentage = Math.round(
                    ((p.price - p.discountPrice) / p.price) * 100
                );

                return (
                    <div
                        key={p._id}
                        onClick={() => navigate(`/product-detail/${p._id}/${slug}`)}
                        className="relative bg-white r shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden group transition"
                    >
                        {/* Top Badge */}
                        {p.isTopOffer === 1 && (
                            <span className="absolute top-3 left-3  text-white text-xs">

                                <button
                                    className="w-[140px] h-[35px] flex items-center justify-start overflow-hidden rounded-[5px]
             shadow-[5px_5px_10px_rgba(0,0,0,0.089)] cursor-pointer bg-transparent border-none
             group"
                                >
                                    {/* Left container */}
                                    <span
                                        className="w-[82%] h-full flex items-center justify-center gap-1
               bg-[rgb(238,0,0)]
               group-hover:bg-[rgb(219,0,0)]
               group-active:bg-[rgb(201,0,0)]"
                                    >
                                        <svg
                                            className="fill-white h-[1em] transition-transform origin-top group-active:scale-[1.15]"
                                            viewBox="0 0 512 512"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                        </svg>

                                        <span className="text-white font-semibold">Top Rated</span>
                                    </span>

                                    {/* Like count */}
                                    <span
                                        className="w-[40%] h-full flex items-center justify-center
               font-semibold text-[rgb(238,0,0)]
               bg-white relative"
                                    >
                                         <span className="text-red-500 text-xs font-semibold">
                                            -{discountPercentage}%
                                        </span>

                                        {/* Triangle */}
                                        <span className="absolute w-2 h-2 bg-white rotate-45 -left-1" />
                                    </span>
                                </button>


                            </span>


                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={(e) => handleCart(e, p._id)}
                            className="absolute top-3 right-3 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition z-10"
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
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="font-semibold text-gray-800 truncate">{p.productName}</h3>

                            {/* Price */}
                            <div className="flex items-center gap-2">
                                <span className="text-green-600 font-bold text-lg">
                                    ₹{p.discountPrice}
                                </span>
                                {p.price > p.discountPrice && (
                                    <>
                                        <span className="text-gray-400 line-through text-sm">
                                            ₹{p.price}
                                        </span>
                                        <span className="text-red-500 text-xs font-semibold">
                                            -{discountPercentage}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Stock */}
                            <span
                                className={`text-xs font-medium ${p.stockQuantity > 0 ? "text-green-600" : "text-red-500"
                                    }`}
                            >
                                {p.stockQuantity > 0
                                    ? `${p.stockQuantity} in stock`
                                    : "Out of stock"}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
