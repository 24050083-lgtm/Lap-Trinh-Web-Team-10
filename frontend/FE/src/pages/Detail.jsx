import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flowers } from "../data/flowers"; 
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext'; // 1. Import Hook giỏ hàng
import { getFallbackImage } from '../utils/imageHelper';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // 2. Lấy hàm addToCart từ Context

  // Tìm sản phẩm dựa trên ID từ URL
  const flower = flowers.find(f => f.id === parseInt(id));

  // Nếu không tìm thấy hoa (Trường hợp ID sai hoặc xóa data)
  if (!flower) {
    return (
      <div className="text-center py-20 min-h-screen flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Sản phẩm không tồn tại!</h2>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 text-orange-500 hover:underline font-medium"
        >
          Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  // 3. Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    addToCart(flower);
    // Bạn có thể thêm logic chuyển hướng đến trang giỏ hàng ngay lập tức nếu muốn:
    // navigate('/cart');
  };

  return (
    <div className="container mx-auto px-5 py-10">
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-8 transition-colors font-medium"
      >
        <ChevronLeft size={20} /> Quay lại
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
        {/* Hình ảnh sản phẩm */}
        <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <img 
            src={flower.image || getFallbackImage(flower.category_name || flower.category, flower.name || flower.id)} 
            alt={flower.name} 
            className="w-full h-[500px] object-cover hover:scale-105 transition duration-500" 
            onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(flower.category_name || flower.category, flower.name || flower.id); }}
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex flex-col justify-center">
          <span className="text-orange-500 font-semibold uppercase tracking-wider text-sm">
            {flower.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            {flower.name}
          </h1>
          <p className="text-3xl font-bold text-orange-600 mb-6">
            {flower.price?.toLocaleString('vi-VN')} đ
          </p>
          
          <div className="border-t border-b border-gray-100 py-6 mb-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Mô tả sản phẩm</h4>
            <p className="text-gray-600 leading-relaxed italic text-lg">
              "{flower.description}"
            </p>
          </div>

          {/* Thông tin tiện ích */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-green-50 p-3 rounded-xl">
              <Truck size={20} className="text-green-600" /> 
              <span className="font-medium">Giao hàng nhanh trong 2h tại nội thành</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-xl">
              <ShieldCheck size={20} className="text-blue-600" /> 
              <span className="font-medium">Cam kết hoa tươi mới mỗi ngày - Bảo hành 24h</span>
            </div>
          </div>

          {/* Nút thêm vào giỏ hàng - Đã kết nối logic */}
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-3 bg-orange-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            <ShoppingCart size={22} /> 
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detail;