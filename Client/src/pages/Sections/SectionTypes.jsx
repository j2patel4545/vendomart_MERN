import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SectionTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9999/api/product-type/")
      .then((res) => {
        setTypes(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("SectionTypes API error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-400 text-sm">
        Loading categories...
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* GRID */}
        <div
          className="
            grid 
            grid-cols-5        /* MOBILE: 6 cards */
            sm:grid-cols-5
            md:grid-cols-7
            lg:flex lg:flex-wrap lg:justify-center  justify-center /* DESKTOP: centered */
            gap-3
          "
        >
          {types.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/product/${item.productTypeName}`)}
              className="
                flex 
                flex-col 
                items-center 
                cursor-pointer
              "
            >
              {/* IMAGE */}
              <div
                className="
                  w-12 h-12           /* SMALL MOBILE SIZE */
                  sm:w-14 sm:h-14
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20    /* DESKTOP SIZE */
                  rounded-full
                  bg-blue-50
                  shadow
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >
                <img
                  src={`http://localhost:9999${item.type_image}`}
                  alt={item.productTypeName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* NAME */}
              <span
                className="
                  mt-1
                  text-[10px]        /* MOBILE SMALL TEXT */
                  sm:text-xs
                  lg:text-sm
                  text-center
                  text-gray-700
                "
              >
                {item.productTypeName}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionTypes;
