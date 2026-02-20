import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { dashboardMenu } from "../router/DashboardConfig";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { logout, admin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 80 }}
      className="h-screen bg-white/80 backdrop-blur-xl shadow-xl fixed left-0 top-0 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-lg"
          >
            Admin Panel
          </motion.h1>
        )}
        <FaBars
          className="cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-1">
        {dashboardMenu.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={`/admin/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-[#112A46] text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50"
                }`
              }
            >
              <Icon size={20} />
              {isOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 🔴 Logout Section (BOTTOM FIXED) */}
      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium
                     text-red-600 hover:bg-red-50 transition"
        >
          <FaSignOutAlt size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
