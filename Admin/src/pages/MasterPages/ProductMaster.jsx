import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

import UserGrid from "../../components/UserGrid";
import Modal from "../../components/Modal";

const ProductMaster = () => {
  const [data, setData] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    productTypeId: "",
    description: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    status: true,
    isFeatured: 0,
    isTopOffer: 0,
    image: null,
  });

  // Fetch data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/product-master");
      setData(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to fetch products", "error");
    }
  };

  const fetchProductTypes = async () => {
    const res = await axios.get("http://localhost:9999/api/product-type");
    setProductTypes(res.data || []);
  };

  useEffect(() => {
    fetchData();
    fetchProductTypes();
  }, []);

  // Add modal
  const handleAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setFormData({
      productName: "",
      productCode: "",
      productTypeId: "",
      description: "",
      price: "",
      discountPrice: "",
      stockQuantity: "",
      status: true,
      isFeatured: 0,
      isTopOffer: 0,
      image: null,
    });
    setIsModalOpen(true);
  };

  // Edit modal
  const handleEdit = (row) => {
    setIsEdit(true);
    setEditId(row._id);
    setFormData({
      productName: row.productName,
      productCode: row.productCode,
      productTypeId: row.productTypeId?._id || "",
      description: row.description || "",
      price: row.price || "",
      discountPrice: row.discountPrice || "",
      stockQuantity: row.stockQuantity || "",
      status: row.status,
      isFeatured: row.isFeatured,
      isTopOffer: row.isTopOffer,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : files ? files[0] : value,
    });
  };

  // Save product
  const handleSave = async () => {
    if (!formData.productName.trim()) {
      Swal.fire("Validation", "Product Name required", "warning");
      return;
    }
    if (!formData.productCode.trim()) {
      Swal.fire("Validation", "Product Code required", "warning");
      return;
    }
    if (!formData.productTypeId) {
      Swal.fire("Validation", "Product Type required", "warning");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("productName", formData.productName);
      payload.append("productCode", formData.productCode);
      payload.append("productTypeId", formData.productTypeId);
      payload.append("description", formData.description || "");
      payload.append("price", formData.price || 0);
      if (formData.discountPrice) payload.append("discountPrice", formData.discountPrice);
      payload.append("stockQuantity", formData.stockQuantity || 0);
      payload.append("status", formData.status);
      payload.append("isFeatured", formData.isFeatured);
      payload.append("isTopOffer", formData.isTopOffer);
      if (formData.image) payload.append("image", formData.image);

      if (isEdit) {
        await axios.put(
          `http://localhost:9999/api/product-master/${editId}`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire("Updated", "Product updated", "success");
      } else {
        await axios.post("http://localhost:9999/api/product-master", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Product added", "success");
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

  // Delete
  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: `Delete ${row.productName}?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/api/product-master/${row._id}`);
        Swal.fire("Deleted", "", "success");
        fetchData();
      } catch {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  const columns = [
    { headerName: "Product", field: "productName", flex: 1 },
    { headerName: "Code", field: "productCode", flex: 1 },
    {
      headerName: "Image",
      field: "image",
      flex: 1,
      cellRenderer: (p) =>
        p.value ? (
          <img
            src={`http://localhost:9999${p.value}`}
            alt=""
            className="h-12 w-12 rounded object-cover cursor-pointer"
            onClick={() => setZoomImage(`http://localhost:9999${p.value}`)}
          />
        ) : null,
    },
    {
      headerName: "Type",
      flex: 1,
      valueGetter: (p) => p.data.productTypeId?.productTypeName || "",
    },
    { headerName: "Price", field: "price", flex: 1 },
    { headerName: "Stock", field: "stockQuantity", flex: 1 },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: (p) => (p.value ? "Active" : "Inactive"),
    },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (p) => (
        <div className="flex gap-3 justify-center">
          <button onClick={() => handleEdit(p.data)}>
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(p.data)}>
            <FaTrash className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product Master</h2>
      <UserGrid columns={columns} data={data} onAdd={handleAdd} addButtonLabel="Add Product" />

      <Modal
        isOpen={isModalOpen}
        title={isEdit ? "Edit Product" : "Add Product"}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#3aa856] text-white rounded" onClick={handleSave}>
              {isEdit ? "Update" : "Save"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 rounded"
          />
          <input
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            placeholder="Product Code"
            className="border p-2 rounded"
          />
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
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="border p-2 rounded"
          />
          <input
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="Discount Price"
            type="number"
            className="border p-2 rounded"
          />
          <input
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="Stock Quantity"
            type="number"
            className="border p-2 rounded"
          />
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={formData.isFeatured === 1}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked ? 1 : 0 })}
            />
            Featured
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={formData.isTopOffer === 1}
              onChange={(e) => setFormData({ ...formData, isTopOffer: e.target.checked ? 1 : 0 })}
            />
            Top Offer
          </label>
        </div>
      </Modal>

      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} alt="zoom" className="max-w-[90%] max-h-[90%] rounded" />
        </div>
      )}
    </div>
  );
};

export default ProductMaster;
