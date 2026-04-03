import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Truck, CheckCircle, XCircle, Clock, 
  MoreVertical, ExternalLink, Filter, Search, Loader2 
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    console.log("Updating order:", id, "to status:", newStatus);
    setUpdatingId(id);
    try {
      await axios.patch(
        `http://localhost:9999/api/orders/${id}/status`,
        { status: newStatus }
      );
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err.response?.data || err.message);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Shipped": return "bg-blue-100 text-blue-700 border-blue-100";
      case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-100";
      case "Cancelled": return "bg-rose-100 text-rose-700 border-rose-100";
      default: return "bg-gray-100 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock size={14} />;
      case "Shipped": return <Truck size={14} />;
      case "Delivered": return <CheckCircle size={14} />;
      case "Cancelled": return <XCircle size={14} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#112A46] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading orders management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#112A46]">Order Management</h1>
          <p className="text-gray-500 text-sm">Monitor and manage all customer purchases</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#112A46]/10 transition-all text-sm w-64"
            />
          </div>
          <button className="p-2 border rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[#112A46] text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {orders.map((order) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden p-1 flex-shrink-0">
                          <img 
                            src={`http://localhost:9999${order.productId?.image}`} 
                            alt="" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#112A46]">{order.productId?.productName}</div>
                          <div className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">#{order._id.substring(order._id.length-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-[#112A46]">{order.address?.fullName}</div>
                      <div className="text-xs text-gray-500">{order.address?.mobile}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-black text-[#112A46]">₹{order.totalPrice}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Qty: {order.quantity} • PREPAID</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          className="text-xs border border-gray-200 rounded-lg p-1.5 outline-none bg-gray-50 focus:border-[#112A46] transition-all"
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button className="p-2 text-gray-400 hover:text-[#112A46] transition-colors">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#112A46]">No orders found yet</h3>
            <p className="text-gray-400 text-sm">When customers buy products, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
