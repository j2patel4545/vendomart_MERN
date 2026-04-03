import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import UserGrid from "../../components/UserGrid";
import Modal from "../../components/Modal";

const ProductSlider = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // form state
  const [formData, setFormData] = useState({
    productTypeId: "",
    sliderName: "",
    remark: "",
    status: true,
    homepage: 0,
    slider_image: null,
  });

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9999/api/slider-images"
      );
      setData(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to fetch sliders", "error");
    }
  };

  const fetchProductTypes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9999/api/product-type"
      );
      setProductTypes(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to fetch product types", "error");
    }
  };

  useEffect(() => {
    fetchData();
    fetchProductTypes();
  }, []);

  /* ================= ADD ================= */
  const handleAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setFormData({
      productTypeId: "",
      sliderName: "",
      remark: "",
      status: true,
      homepage: 0,
      slider_image: null,
    });
    setIsModalOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (row) => {
    setIsEdit(true);
    setEditId(row._id);
    setFormData({
      productTypeId: row.productTypeId?._id,
      sliderName: row.sliderName,
      remark: row.remark,
      status: row.status,
      homepage: row.homepage,
      slider_image: null,
    });
    setIsModalOpen(true);
  };

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : files
          ? files[0]
          : value,
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formData.productTypeId || !formData.sliderName.trim()) {
      Swal.fire("Validation", "Required fields missing", "warning");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = new FormData();
      payload.append("productTypeId", formData.productTypeId);
      payload.append("sliderName", formData.sliderName);
      payload.append("remark", formData.remark);
      payload.append("status", formData.status);
      payload.append("homepage", formData.homepage);
      if (formData.slider_image)
        payload.append("slider_image", formData.slider_image);

      if (isEdit) {
        await axios.put(
          `http://localhost:9999/api/slider-images/${editId}`,
          payload,
          config
        );
        Swal.fire("Updated", "Slider updated", "success");
      } else {
        await axios.post(
          "http://localhost:9999/api/slider-images",
          payload,
          config
        );
        Swal.fire("Success", "Slider added", "success");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: `Delete ${row.sliderName}?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(
          `http://localhost:9999/api/slider-images/${row._id}`,
          config
        );
        Swal.fire("Deleted", "", "success");
        fetchData();
      } catch {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };


const columns = [
  {
    headerName: "Slider Name",
    field: "sliderName",
    flex: 1,
  },
  {
    headerName: "Product Type",
    field: "productTypeId.productTypeName",
    flex: 1,
    valueGetter: (p) => p.data.productTypeId?.productTypeName,
  },
  {
    headerName: "Image",
    field: "slider_image",
    flex: 1,
    cellRenderer: (params) => (
      <img
        src={`http://localhost:9999${params.value}`}
        alt=""
        className="h-12 w-20 rounded m-2 object-cover cursor-pointer hover:scale-110 transition"
        onClick={() => setZoomImage(`http://localhost:9999${params.value}`)}
      />
    ),
  },
  {
    headerName: "Status",
    field: "status",
    flex: 1,
    cellRenderer: (p) => (p.value ? "Active" : "Inactive"),
  },
  {
    headerName: "Homepage",
    field: "homepage",
    flex: 1,
    cellRenderer: (p) =>
      p.value === 1 ? (
        <FaCheckCircle className="text-green-500 mx-auto" />
      ) : (
        <FaTimesCircle className="text-red-500 mx-auto" />
      ),
  },
  {
    headerName: "Actions",
    flex: 1,
    cellRenderer: (params) => (
      <div className="flex justify-center gap-3 text-lg">
        <button onClick={() => handleEdit(params.data)}>
          <FaEdit />
        </button>
        <button onClick={() => handleDelete(params.data)}>
          <FaTrash className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  /* ================= RENDER ================= */
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Product Sliders</h2>
      </div>

      <UserGrid
        columns={columns}
        data={data}
        onAdd={handleAdd}
        addButtonLabel="Add Slider"
      />

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        title={isEdit ? "Edit Slider" : "Add Slider"}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#3aa856] text-white rounded"
              onClick={handleSave}
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <select
            name="productTypeId"
            value={formData.productTypeId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Product Type</option>
            {productTypes.map((pt) => (
              <option key={pt._id} value={pt._id}>
                {pt.productTypeName}
              </option>
            ))}
          </select>

          <input
            name="sliderName"
            value={formData.sliderName}
            onChange={handleChange}
            placeholder="Slider Name"
            className="border p-2 rounded"
          />

          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            placeholder="Remark"
            className="border p-2 rounded"
          />

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            Active
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={formData.homepage === 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  homepage: e.target.checked ? 1 : 0,
                })
              }
            />
            Show on Homepage
          </label>

          <input
            type="file"
            name="slider_image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </Modal>

      {/* IMAGE ZOOM */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="zoom"
            className="max-w-[90%] max-h-[90%] rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ProductSlider;
