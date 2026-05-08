import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { getFallbackImage } from '../utils/imageHelper';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, totalPrice } = useCart();

  // Hàm chuyển đổi an toàn cho giá tiền
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? Number(price.replace(/[^\d]/g, '')) : Number(price);
    return (numericPrice || 0).toLocaleString('vi-VN') + 'đ';
  };

  return (
    <>
      {/* Lớp nền đen mờ (Overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Bảng trượt từ bên phải */}
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header của Giỏ hàng */}
        <div className="flex items-center justify-between p-5 border-b border-orange-100 bg-orange-50/50">
          <h2 className="text-xl font-bold text-orange-600 uppercase tracking-wide">Giỏ Hàng</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 font-medium italic">Giỏ hàng của bạn đang trống 🌸</div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                let parsedPrice = 0;
                if (typeof item.price === 'number') parsedPrice = item.price;
                else if (typeof item.price === 'string') {
                  parsedPrice = Number(item.price);
                  if (isNaN(parsedPrice)) parsedPrice = Number(item.price.replace(/[^\d.]/g, '')) || 0;
                }
                const itemTotal = parsedPrice * (Number(item.quantity) || 1);

                return (
                  <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={item.image || getFallbackImage(item.category_name || item.category, item.name || item.id)}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(item.category_name || item.category, item.name || item.id); }}
                    />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{item.name}</h3>
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Số lượng: {item.quantity}</p>
                          <p className="font-bold text-orange-600 text-sm">{itemTotal.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-1 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Nút thanh toán ở dưới đáy */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center font-black text-lg mb-4 text-gray-800">
            <span className="uppercase text-sm tracking-wider text-gray-500">TỔNG TIỀN:</span>
            <span className="text-2xl text-orange-600">{Number(totalPrice || 0).toLocaleString('vi-VN')}đ</span>
          </div>
          <Link
            to="/cart"
            onClick={onClose}
            className="block w-full text-center bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 transition-all uppercase tracking-wider text-sm"
          >
            ĐIẾN TRANG THANH TOÁN
          </Link>
        </div>
      </div>
    </>
  );
};
export default CartDrawer;