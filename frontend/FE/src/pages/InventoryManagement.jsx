import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, Plus, Edit, Trash2 } from 'lucide-react';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' hoặc 'suppliers'
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]); // Giả sử bạn đã có API lấy products

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        if (activeTab === 'suppliers') {
          const res = await axios.get('http://127.0.0.1:8000/api/admin/suppliers/', { headers });
          setSuppliers(res.data);
        } else {
          // Gọi API lấy danh sách sản phẩm (Kho hàng) - Bạn nhớ đổi URL cho khớp với project thực tế
          const res = await axios.get('http://127.0.0.1:8000/api/products/'); 
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <Package className="text-pink-500" /> Quản lý Nội bộ
        </h1>

        {/* NÚT CHUYỂN TAB */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === 'inventory' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-gray-600 border'}`}
          >
            <Package size={20} /> Tồn kho Sản phẩm
          </button>
          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === 'suppliers' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-gray-600 border'}`}
          >
            <Truck size={20} /> Nhà cung cấp
          </button>
        </div>

        {/* NỘI DUNG TAB KHO HÀNG */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-4 font-semibold">Tên Sản Phẩm</th>
                  <th className="p-4 font-semibold">Giá bán</th>
                  <th className="p-4 font-semibold">Số lượng tồn</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">{Number(p.price).toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 font-bold text-gray-800">{p.stock_quantity}</td>
                    <td className="p-4">
                      {p.stock_quantity > 10 ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Còn hàng</span>
                      ) : p.stock_quantity > 0 ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Sắp hết</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Hết hàng</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* NỘI DUNG TAB NHÀ CUNG CẤP */}
        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-700">Danh sách đối tác</h2>
              <button className="bg-pink-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm hover:bg-pink-600">
                <Plus size={16} /> Thêm NCC
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-4 font-semibold">Tên Nhà Cung Cấp</th>
                  <th className="p-4 font-semibold">Điện thoại</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">Chưa có dữ liệu nhà cung cấp.</td></tr>
                ) : (
                  suppliers.map(s => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{s.name}</td>
                      <td className="p-4">{s.phone}</td>
                      <td className="p-4">{s.email || '-'}</td>
                      <td className="p-4 text-center flex justify-center gap-3">
                        <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                        <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;