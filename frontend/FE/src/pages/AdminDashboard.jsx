import { ShoppingBag, Users, DollarSign, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    // Giả lập dữ liệu thống kê
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const totalRevenue = orders.reduce((acc, curr) => acc + Number(curr.total_price || 0), 0);
    const totalUsers = JSON.parse(localStorage.getItem('usersDb') || '[]').length;

    const stats = [
        { title: "Tổng doanh thu", value: `${totalRevenue.toLocaleString('vi-VN')} đ`, icon: <DollarSign size={24} />, color: "bg-emerald-500", shadow: "shadow-emerald-100" },
        { title: "Tổng đơn hàng", value: orders.length, icon: <ShoppingBag size={24} />, color: "bg-orange-500", shadow: "shadow-orange-100" },
        { title: "Tổng khách hàng", value: totalUsers, icon: <Users size={24} />, color: "bg-blue-500", shadow: "shadow-blue-100" },
        { title: "Bó hoa đang bán", value: "21+", icon: <Package size={24} />, color: "bg-purple-500", shadow: "shadow-purple-100" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pt-12 pb-40 px-6">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-16">
                    <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Store Overview</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic">Bảng điều khiển Quản trị</h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-start"
                        >
                            <div className={`${stat.color} text-white p-4 rounded-2xl mb-6 shadow-xl ${stat.shadow}`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2">{stat.title}</h3>
                            <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Quick Access */}
                    <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black italic mb-8 uppercase tracking-tight">Truy cập nhanh</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <Link to="/admin/products" className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-orange-500 transition-all">
                                <span className="font-black text-gray-900 group-hover:text-white transition-colors">Quản lý kho hoa</span>
                                <ArrowRight size={20} className="text-gray-300 group-hover:text-white" />
                            </Link>
                            <Link to="/admin/orders" className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-orange-500 transition-all">
                                <span className="font-black text-gray-900 group-hover:text-white transition-colors">Xử lý đơn hàng</span>
                                <ArrowRight size={20} className="text-gray-300 group-hover:text-white" />
                            </Link>
                            <Link to="/admin/customers" className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-orange-500 transition-all">
                                <span className="font-black text-gray-900 group-hover:text-white transition-colors">Danh sách khách hàng</span>
                                <ArrowRight size={20} className="text-gray-300 group-hover:text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Recent Orders Insight */}
                    <div className="bg-gray-900 text-white rounded-[3.5rem] p-10 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-2xl font-black italic mb-8 uppercase tracking-tight relative z-10 text-orange-500">Đơn hàng mới nhất</h2>
                        <div className="space-y-6 relative z-10">
                            {orders.slice(0, 4).map((order) => (
                                <div key={order.id} className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <div>
                                        <p className="font-black text-sm uppercase">#{order.id}</p>
                                        <p className="text-[10px] text-gray-500 font-bold">{order.date}</p>
                                    </div>
                                    <p className="font-black text-orange-500">{Number(order.total_price).toLocaleString('vi-VN')} đ</p>
                                </div>
                            ))}
                            {orders.length === 0 && <p className="text-gray-500 italic">Chưa có dữ liệu đơn hàng.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


