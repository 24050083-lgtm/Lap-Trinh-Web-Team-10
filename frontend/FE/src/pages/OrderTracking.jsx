import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, SearchX, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getFallbackImage } from '../utils/imageHelper';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const email = user?.email || localStorage.getItem('guest_email');
            if (!email) {
                const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                setOrders(savedOrders);
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://127.0.0.1:8000/api/orders/?email=${email}`);
            
            const formattedOrders = response.data.map(o => ({
                id: o.id,
                date: new Date(o.created_at).toLocaleDateString('vi-VN'),
                status: o.status === 'PENDING' ? 'Pending' :
                        o.status === 'PROCESSING' ? 'Processing' :
                        o.status === 'SHIPPED' ? 'Shipped' :
                        o.status === 'DELIVERED' ? 'Completed' : 'Pending',
                shipping_address: o.shipping_address,
                total_price: o.total_amount,
                items: o.items.map(item => ({
                    id: item.id,
                    name: item.product_name || 'Hoa thiết kế',
                    image: item.product_image,
                    quantity: item.quantity,
                    price: item.price_at_purchase
                }))
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng", error);
            const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            setOrders(savedOrders);
        } finally {
            setLoading(false);
        }
    };

    fetchOrders();
  }, [user]);

  const toggleExpand = (orderId) => {
      if (expandedOrder === orderId) {
          setExpandedOrder(null);
      } else {
          setExpandedOrder(orderId);
      }
  };

  const steps = [
    { key: 'Pending', label: 'ChĐỏ duyệt', icon: <Clock size={16}/>, color: 'text-amber-500' },
    { key: 'Processing', label: 'Đang làm', icon: <Package size={16}/>, color: 'text-blue-500' },
    { key: 'Shipped', label: 'Đang giao', icon: <Truck size={16}/>, color: 'text-purple-500' },
    { key: 'Completed', label: 'Thành công', icon: <CheckCircle size={16}/>, color: 'text-emerald-500' },
  ];

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
      );
  }

  if (orders.length === 0) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-12 rounded-[3.5rem] shadow-sm text-center max-w-md">
                <SearchX size={80} strokeWidth={1} className="text-gray-200 mx-auto mb-6" />
                <h2 className="text-3xl font-serif font-black mb-4 italic">Chưa có đơn hàng</h2>
                <p className="text-gray-400 font-medium mb-10">Bạn vẫn chưa đặt đơn hoa nào. Hãy ghé cửa hàng để chọn một bó hoa đẹp nhất nhé!</p>
                <a href="/products" className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-black transition-all">
                    Đến cửa hàng
                </a>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-40 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic tracking-tight">Đơn hàng của bạn</h1>
            <p className="text-gray-400 font-medium italic mt-2">Theo dõi hành trình mang niềm vui đến tay bạn</p>
        </div>

        <div className="space-y-12">
            {orders.map((order, orderIdx) => (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: orderIdx * 0.1 }}
                    key={order.id} 
                    className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 overflow-hidden relative"
                >
                    {/* Header đơn hàng */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-gray-50 text-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-500 text-white w-12 h-12 flex items-center justify-center rounded-2xl">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest block leading-none mb-1">Mã đơn hàng</span>
                                <span className="text-xl font-black text-gray-900">#{order.id}</span>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest block leading-none mb-1">Ngày đặt</span>
                            <span className="font-black text-gray-700">{order.date}</span>
                        </div>
                    </div>

                    {/* Tiến trình */}
                    <div className="relative mb-16 px-4">
                        <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 -z-10 rounded-full">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(steps.findIndex(s => s.key === order.status) / (steps.length - 1)) * 100}%` }}
                                className="h-full bg-orange-500 rounded-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            {steps.map((step, idx) => {
                                const isActive = order.status === step.key;
                                const isCompleted = steps.findIndex(s => s.key === order.status) >= idx;
                                
                                return (
                                    <div key={step.key} className="flex flex-col items-center w-24 text-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-lg ${
                                            isActive ? 'bg-orange-500 text-white scale-110 shadow-orange-200' : 
                                            isCompleted ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {step.icon}
                                        </div>
                                        <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${
                                            isActive ? 'text-orange-500' : isCompleted ? 'text-gray-900' : 'text-gray-300'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Nội dung đơn hàng */}
                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 flex flex-col md:flex-row justify-between gap-10">
                        <div className="space-y-6 flex-1">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm"><MapPin size={18} className="text-orange-500" /></div>
                                <div>
                                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest block mb-1">Địa chỉ giao</span>
                                    <p className="text-sm font-bold text-gray-800 leading-relaxed">{order.shipping_address || order.address || 'Không có địa chỉ'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleExpand(order.id)}
                                className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                            >
                                {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {expandedOrder === order.id ? 'Thu gọn chi tiết' : 'Xem chi tiết sản phẩm'}
                            </button>
                        </div>
                        
                        <div className="flex flex-col md:items-end justify-center min-w-[150px]">
                            <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest block mb-1">Tổng thanh toán</span>
                            <span className="text-3xl font-black text-orange-500">
                                {Number(order.total_price || order.total).toLocaleString('vi-VN')} đ
                            </span>
                        </div>
                    </div>

                    {/* Chi tiết sản phẩm (Accordion) */}
                    <AnimatePresence>
                        {expandedOrder === order.id && order.items && order.items.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 px-8"
                            >
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Sản phẩm trong đơn hàng</h4>
                                    <div className="space-y-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                                    <img 
                                                        src={item.image ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`) : getFallbackImage('Hoa', item.name)} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h5>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        Số lượng: <span className="text-orange-500">{item.quantity}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right pr-4">
                                                    <span className="font-black text-gray-900 block">
                                                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

