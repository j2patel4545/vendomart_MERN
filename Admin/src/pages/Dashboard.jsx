import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBoxOpen,
  FaLayerGroup,
  FaImages,
  FaChartLine,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    productTypes: 0,
    products: 0,
    sliders: 0,
    chartData: [0, 0, 0, 0, 0, 0, 0],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:9999/api/admin/dashboard-stats", // ✅ FIXED PORT
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats({
          users: res.data.users || 0,
          productTypes: res.data.productTypes || 0,
          products: res.data.products || 0,
          sliders: res.data.sliders || 0,
          chartData: res.data.chartData || [0, 0, 0, 0, 0, 0, 0],
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: FaUsers,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Product Types",
      value: stats.productTypes,
      icon: FaLayerGroup,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Products",
      value: stats.products,
      icon: FaBoxOpen,
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "Active Sliders",
      value: stats.sliders,
      icon: FaImages,
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Here's what's happening with your store today.
        </p>
      </motion.div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className={`relative overflow-hidden bg-gradient-to-br ${card.color} p-6 rounded-2xl shadow-xl text-white`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <card.icon className="text-8xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <card.icon className="text-2xl" />
                </div>
                <h3 className="font-semibold text-lg">{card.title}</h3>
              </div>

              <p className="text-5xl font-bold mt-4">
                {loading ? "..." : card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHART */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-lg border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaChartLine /> New Users Analytics
          </h2>
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm">
            This Week
          </span>
        </div>

        <div className="h-64 flex items-end justify-between gap-2 mt-4 px-4">
          {(stats.chartData || [0, 0, 0, 0, 0, 0, 0]).map((count, idx) => {
            const maxCount = Math.max(
              ...(stats.chartData || [0]),
              1
            );

            const height = Math.max(
              (count / maxCount) * 100,
              5
            );

            return (
              <div
                key={idx}
                className="w-1/12 flex flex-col items-center group"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.5 + idx * 0.1,
                  }}
                  className="w-full bg-blue-200 hover:bg-blue-500 rounded-t-xl relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    {count}
                  </div>
                </motion.div>

                <span className="mt-2 text-xs text-gray-400">
                  Day {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;