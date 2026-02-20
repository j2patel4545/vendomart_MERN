import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import UserGrid from "../components/UserGrid";

const Users = () => {
  const [data, setData] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/users");
      setData(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE USER ================= */
  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: `Delete ${row.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:9999/api/users/${row._id}`
        );
        Swal.fire("Deleted", "User deleted successfully", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire(
          "Error",
          err?.response?.data?.message || "Delete failed",
          "error"
        );
      }
    }
  };

  /* ================= GRID COLUMNS ================= */
  const columns = [
    {
      headerName: "Profile",
      field: "profileImage",
      flex: 1,
      cellRenderer: (params) => (
        params.value ? (
          <img
            src={`http://localhost:9999${params.value}`}
            alt=""
            className="h-12 w-12 rounded-full object-cover cursor-pointer hover:scale-110 transition"
            onClick={() =>
              setZoomImage(`http://localhost:9999${params.value}`)
            }
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            N/A
          </div>
        )
      ),
    },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
    },
    {
      headerName: "Email",
      field: "email",
      flex: 1.5,
    },
    {
      headerName: "Phone",
      field: "phone",
      flex: 1,
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: (p) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            p.value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {p.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      headerName: "Created At",
      field: "createdAt",
      flex: 1.2,
      cellRenderer: (p) =>
        new Date(p.value).toLocaleString(),
    },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex justify-center gap-3 text-lg">
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
        <h2 className="text-2xl font-bold">Users</h2>
      </div>

      {/* Grid */}
      <UserGrid
        columns={columns}
        data={data}
        addButtonLabel={null}
      />

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

export default Users;
