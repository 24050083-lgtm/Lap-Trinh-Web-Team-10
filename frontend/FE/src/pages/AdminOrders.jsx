import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Box, Truck, CheckCircle, Clock, XCircle, Eye, X, MapPin, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/admin/orders/');
      setOrders(response.data);
    } catch (error) {
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(localOrders);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    toast.success(`Cập nhật trạng thái đơn #${orderId} thành công!`);
  };

  const statusMap = {
    'Pending': { label: 'ChĐỏ duyệt', icon: <Clock size={14} />, color: 'bg-amber-100 text-amber-700' },
    'Processing': { label: 'Đang làm', icon: <Box size={14} />, color: 'bg-blue-100 text-blue-700' },
    'Shipped': { label: 'Đang giao', icon: <Truck size={14} />, color: 'bg-purple-100 text-purple-700' },
    'Completed': { label: 'Thành công', icon: <CheckCircle size={14} />, color: 'bg-emerald-100 text-emerald-700' },
    'Cancelled': { label: 'Đã hủy', icon: <XCircle size={14} />, color: 'bg-rose-100 text-rose-700' }
  };

  if (loading) return <div className="p-40 text-center font-black uppercase tracking-widest text-orange-500">Đang tải đơn hàng...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-40 px-6">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16">
            <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Sales Management</span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic">Quản lý Đơn hàng</h1>
        </header>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                  <th className="p-8">Mã đơn</th>
                  <th className="p-8">Khách hàng / Địa chỉ</th>
                  <th className="p-8">Thành tiền</th>
                  <th className="p-8 text-center">Trạng thái</th>
                  <th className="p-8 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50">
                    <td className="p-8">
                        <span className="font-black text-gray-900 block leading-none">#{order.id}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{order.date}</span>
                    </td>
                    <td className="p-8">
                        <div className="max-w-xs">
                            <p className="text-sm font-black text-gray-800 uppercase tracking-tight line-clamp-1">{order.shipping_address || "N/A"}</p>
                        </div>
                    </td>
                    <td className="p-8">
                        <span className="text-xl font-black text-orange-600 italic">{(order.total_price || order.total).toLocaleString('vi-VN')} đ</span>
                    </td>
                    <td className="p-8">
                        <div className="flex justify-center">
                            <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[order.status]?.color || 'bg-gray-100'}`}>
                                {statusMap[order.status]?.label || order.status}
                            </span>
                        </div>
                    </td>
                    <td className="p-8 text-right space-x-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all text-gray-500 shadow-sm"><Eye size={16}/></button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none focus:border-orange-500 cursor-pointer shadow-sm"
                        >
                          {Object.keys(statusMap).map(key => <option key={key} value={key}>{statusMap[key].label}</option>)}
                        </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tight">Chi tiết đơn hàng #{selectedOrder.id}</h2>
                        <p className="text-xs text-orange-500 font-bold tracking-widest mt-1 uppercase">{selectedOrder.date}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
                </div>
                
                <div className="p-10 overflow-y-auto space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-2 flex items-center gap-2">
                                <UserIcon size={14} /> Khách hàng
                            </h3>
                            <p className="font-black text-lg text-gray-900 italic line-clamp-1">{selectedOrder.shipping_address}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-2 flex items-center gap-2">
                                <MapPin size={14} /> Địa chỉ giao hoa
                            </h3>
                            <p className="font-bold text-sm text-gray-600 leading-relaxed italic">{selectedOrder.shipping_address}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-2">Danh sách hoa đã đặt</h3>
                        <div className="space-y-4">
                            {(selectedOrder.items || []).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase">{item.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold">{item.price.toLocaleString('vi-VN')} đ x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-gray-900">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-8 rounded-[2rem] flex justify-between items-center shadow-xl shadow-gray-200">
                        <span className="text-sm font-black uppercase tracking-widest italic opacity-60">Tổng thanh toán</span>
                        <span className="text-3xl font-black text-orange-500">{Number(selectedOrder.total_price).toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

