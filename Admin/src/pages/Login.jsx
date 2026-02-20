import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:9999/api/admin/login",
        { email, password }
      );

      // Save auth data
      localStorage.setItem("authUser", JSON.stringify(res.data));

      // Remember email
      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      login(res.data);
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf4ff]">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f4faff] w-[360px] p-8 rounded-2xl shadow-xl"
      >
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <FaUserCircle className="text-blue-500 text-6xl" />
        </div>

        {/* Username */}
        <div className="relative mb-4">
          <FaUser className="absolute top-3.5 left-3 text-blue-400" />
          <input
            type="email"
            placeholder="Username"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-blue-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-3">
          <FaLock className="absolute top-3.5 left-3 text-blue-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-blue-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-3.5 right-3 cursor-pointer text-blue-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Remember & Forgot */}
        <div className="flex justify-between items-center text-sm text-blue-600 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-blue-500"
            />
            Remember me
          </label>
          <span className="cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>

        {/* Login Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-blue-600 transition"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Login;
