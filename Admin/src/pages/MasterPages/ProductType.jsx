import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import UserGrid from "../../components/UserGrid";
import Modal from "../../components/Modal";

const ProductType = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // form state
  const [formData, setFormData] = useState({
    productTypeName: "",
    description: "",
    image: null,
  });

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/product-type");
      setData(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to fetch data", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= OPEN ADD ================= */
  const handleAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setFormData({ productTypeName: "", description: "", image: null });
    setIsModalOpen(true);
  };

  /* ================= OPEN EDIT ================= */
  const handleEdit = (row) => {
    setIsEdit(true);
    setEditId(row._id);
    setFormData({
      productTypeName: row.productTypeName,
      description: row.description,
      image: null,
    });
    setIsModalOpen(true);
  };

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  /* ================= SAVE (ADD / UPDATE) ================= */
  const handleSave = async () => {
    if (!formData.productTypeName.trim()) {
      Swal.fire("Validation", "Product Type Name required", "warning");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = new FormData();
      payload.append("productTypeName", formData.productTypeName);
      payload.append("description", formData.description);
      if (formData.image) payload.append("image", formData.image);

      if (isEdit) {
        await axios.put(
          `http://localhost:9999/api/product-type/${editId}`,
          payload,
          config
        );
        Swal.fire("Updated", "Product Type updated", "success");
      } else {
        await axios.post(
          "http://localhost:9999/api/product-type",
          payload,
          config
        );
        Swal.fire("Success", "Product Type added", "success");
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
      title: `Delete ${row.productTypeName}?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(
          `http://localhost:9999/api/product-type/${row._id}`,
          config
        );
        Swal.fire("Deleted", "", "success");
        fetchData();
      } catch {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  /* ================= GRID ================= */
  const columns = [
    {
      headerName: "Product Type",
      field: "productTypeName",
      flex: 1,
    },
    {
      headerName: "Image",
      field: "type_image",
      flex: 1,
      cellRenderer: (params) => (
        <img
          src={`http://localhost:9999${params.value}`}
          alt=""
          className="h-12 w-12 rounded-full m-2 object-cover cursor-pointer hover:scale-110 transition"
          onClick={() =>
            setZoomImage(`http://localhost:9999${params.value}`)
          }
        />
      ),
    },
    {
      headerName: "Description",
      field: "description",
      flex: 2,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      flex: 1,
      cellRenderer: (p) =>
        new Date(p.value).toLocaleString(),
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Product Types</h2>
      </div>

      {/* Grid */}
      <UserGrid columns={columns} data={data} onAdd={handleAdd} addButtonLabel="Add Product Type" />

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        title={isEdit ? "Edit Product Type" : "Add Product Type"}
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
          <input
            name="productTypeName"
            value={formData.productTypeName}
            onChange={handleChange}
            placeholder="Product Type Name"
            className="border p-2 rounded"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
          />

          <input
            type="file"
            name="image"
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

export default ProductType;
