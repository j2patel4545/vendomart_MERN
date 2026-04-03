import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:9999/api/users/login",
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#112944] bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#1e3a5f] to-[#112944] p-4 font-['Inter',_sans-serif]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 pb-4">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-[#0166C7] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                <LogIn className="text-white w-8 h-8 rotate-6" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-extrabold text-center text-[#112944] mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Sign in to manage your Vendo Mart account
            </p>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-start gap-3"
                >
                  <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#112944] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0166C7] transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] focus:ring-4 focus:ring-[#0166C7]/10 transition-all text-[#112944]"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-[#112944]">Password</label>
                  <a href="#" className="text-xs font-medium text-[#0166C7] hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0166C7] transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] focus:ring-4 focus:ring-[#0166C7]/10 transition-all text-[#112944]"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#0166C7] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${
                  loading ? "bg-blue-400 cursor-not-allowed" : "bg-[#0166C7] hover:bg-[#005bb8]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <LogIn size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <div className="p-8 pt-0 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0166C7] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-white/40 text-xs text-center mt-8">
          &copy; 2026 Vendo Mart Inc. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
