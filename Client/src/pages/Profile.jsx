import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState("");

  /* Load user data */
  useEffect(() => {
    if (storedUser) {
      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        password: "",
        profileImage: null,
      });

      setPreview(
        `http://localhost:9999${storedUser.profileImage || "/default-user.png"}`
      );
    }
  }, []);

  /* Handle input change */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* Update Profile */
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);

      if (formData.password) {
        data.append("password", formData.password);
      }

      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const res = await axios.put(
        `http://localhost:9999/api/users/${storedUser._id}`,
        data
      );

      // Update localStorage user
      const updatedUser = {
        ...storedUser,
        ...res.data.user,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!storedUser) {
    return <div className="p-10 text-center">User not logged in</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Profile</h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border"
            />

            {editMode && (
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="mt-3 text-sm"
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-500">Name</label>
              {editMode ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <User size={16} /> {formData.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-500">Email</label>
              {editMode ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <Mail size={16} /> {formData.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              {editMode ? (
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <Phone size={16} /> {formData.phone || "—"}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm text-gray-500">Address</label>
              {editMode ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> {formData.address || "—"}
                </p>
              )}
            </div>

            {/* Password */}
            {editMode && (
              <div>
                <label className="text-sm text-gray-500">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Leave blank to keep same password"
                />
              </div>
            )}

            {/* Save Button */}
            {editMode && (
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="mt-4 flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
