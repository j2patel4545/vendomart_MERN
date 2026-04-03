import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

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
      <div className="flex justify-center py-20 bg-white">
        <div className="animate-spin h-6 w-6 border-2 border-[#0166C7] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <section className="w-full bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8"
        >
          {types.map((item) => (
            <motion.div
              key={item._id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/product/${item.productTypeName}`)}
              className="group flex flex-col items-center cursor-pointer min-w-[80px] sm:min-w-[100px]"
            >
              <div className="relative mb-4">
                {/* Visual Pod Background */}
                <div className="absolute inset-0 bg-[#0166C7]/5 group-hover:bg-[#0166C7]/10 rounded-[2rem] transition-colors -m-3 sm:-m-4 border border-gray-100 group-hover:border-[#0166C7]/20 shadow-sm" />
                
                {/* Image Container */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl overflow-hidden p-2 group-hover:shadow-2xl transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#0166C7]/20">
                  <img
                    src={`http://localhost:9999${item.type_image}`}
                    alt={item.productTypeName}
                    className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Status Dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm scale-0 group-hover:scale-100 transition-transform" />
              </div>

              {/* Typography */}
              <span className="relative text-[10px] sm:text-xs font-black text-[#112944] uppercase tracking-[0.1em] text-center group-hover:text-[#0166C7] transition-colors mt-2">
                {item.productTypeName}
              </span>
              <div className="w-0 h-0.5 bg-[#0166C7]/30 group-hover:w-full transition-all duration-300 mt-1 rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionTypes;
