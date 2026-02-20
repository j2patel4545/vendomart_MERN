import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const BASE = "http://localhost:9999/api/admin";

const Profile = () => {
  const { admin, setAdmin, token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(
    admin?.image ? `http://localhost:9999${admin.image}` : ""
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      if (formData.password) payload.append("password", formData.password);
      if (formData.image) payload.append("image", formData.image);

      const { data } = await axios.put(`${BASE}/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data?.admin) throw new Error("Invalid response");

      setAdmin(data.admin);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      Swal.fire("Success", "Profile updated successfully", "success");
      setEditMode(false);
      setFormData({ ...formData, password: "" });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-[#eaf4ff] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={preview}
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover shadow"
              />
              {editMode && (
                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                  <FaCamera className="text-white text-xl" />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    hidden
                    onChange={handleChange}
                  />
                </label>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {admin?.name}
              </h2>
              <p className="text-gray-500">{admin?.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Admin Panel Access
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Form */}
        {editMode && (
          <motion.form
            onSubmit={handleUpdate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {["name", "email"].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium">New Password</label>
              <input
                name="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end mt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                type="submit"
                className="bg-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Profile"}
              </motion.button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
