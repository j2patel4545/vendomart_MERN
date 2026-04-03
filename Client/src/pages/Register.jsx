import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Phone, MapPin, Camera, 
  UserPlus, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, profileImage: file });
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name || !form.email || !form.password) {
      return setError("Please fill in all required fields (Name, Email, Password)");
    }

    try {
      setLoading(true);

      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) fd.append(key, form[key]);
      });

      await axios.post(
        "http://localhost:9999/api/users/register",
        fd
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#112944] bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#1e3a5f] to-[#112944] py-12 px-4 font-['Inter',_sans-serif]">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 pb-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#0166C7] rounded-2xl flex items-center justify-center shadow-lg transform rotate-6">
                <UserPlus className="text-white w-8 h-8 -rotate-6" />
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-center text-[#112944] mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Join Vendo Mart and start shopping today
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
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg flex items-start gap-3"
                >
                  <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-700">Account created successfully! Redirecting to login...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 flex flex-col items-center mb-4">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-full border-4 border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center group-hover:border-[#0166C7] transition-all">
                    {preview ? (
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-gray-300 w-10 h-10 group-hover:text-[#0166C7] transition-all" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-[#0166C7] text-white p-1.5 rounded-full shadow-md">
                    <Camera size={14} />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <span className="text-xs text-gray-400 mt-1">Upload Profile Picture</span>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-[#112944] ml-1">Full Name *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0166C7] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] focus:ring-4 focus:ring-[#0166C7]/10 transition-all text-[#112944]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-[#112944] ml-1">Email Address *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0166C7] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] focus:ring-4 focus:ring-[#0166C7]/10 transition-all text-[#112944]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-[#112944] ml-1">Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0166C7] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] focus:ring-4 focus:ring-[#0166C7]/10 transition-all text-[#112944]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#0166C7] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-[#112944] ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0166C7] transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] focus:ring-4 focus:ring-[#0166C7]/10 transition-all text-[#112944]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[#112944] ml-1">Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0166C7] transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Street Name, City, Country"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#0166C7] focus:ring-4 focus:ring-[#0166C7]/10 transition-all text-[#112944]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2 pt-4">
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register</span>
                      <UserPlus size={20} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>

          <div className="p-8 pt-0 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0166C7] font-bold hover:underline">
                Sign In
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
