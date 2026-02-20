import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: isOpen ? 260 : 80 }}
        className="flex-1 min-h-screen"
      >
        {/* ✅ Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <Outlet />
        </motion.section>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
