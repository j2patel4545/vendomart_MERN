import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopNavbar = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();

  return (
    <header className="h-14 bg-white/70 backdrop-blur shadow flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* Left Title */}
      <h2 className="font-semibold text-lg">Admin Dashboard</h2>

      {/* Right Profile */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate("/admin/profile")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{admin?.name}</p>
          <p className="text-xs text-gray-500">{admin?.email}</p>
        </div>

        <img
          src={`http://localhost:9999${admin?.image}`}
          alt="profile"
          className="w-9 h-9 rounded-full object-cover border"
        />
      </motion.div>
    </header>
  );
};

export default TopNavbar;
