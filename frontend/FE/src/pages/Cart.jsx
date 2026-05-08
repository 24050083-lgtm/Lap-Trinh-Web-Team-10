import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, CreditCard, Truck, ShieldCheck, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFallbackImage } from '../utils/imageHelper';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Cart = () => {
  const { cart, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftSender, setGiftSender] = useState('');
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const SHIPPING_FEE = 30000;
  const MESSAGE_FEE = 20000;
  const finalTotalPrice = totalPrice + SHIPPING_FEE + (isGift ? MESSAGE_FEE : 0);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ nhận hoa!");
      return;
    }

    setLoading(true);

    const orderData = {
        items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        total_price: finalTotalPrice,
        shipping_fee: SHIPPING_FEE,
        message_fee: isGift ? MESSAGE_FEE : 0,
        is_gift: isGift,
        gift_sender: giftSender,
        gift_recipient: giftRecipient,
        gift_message: giftMessage,
        shipping_address: address,
        payment_method: paymentMethod,
        email: user?.email || 'guest@example.com',
        name: user?.name || 'Guest',
        phone: user?.phone || '' 
    };

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/checkout/', orderData);
        if (response.status === 201) {
            toast.success("Đặt hoa thành công! Chúc bạn ngày mới tốt lành.");
            clearCart();
            localStorage.setItem('guest_email', orderData.email);
            // Cập nhật mảng orders ảo để Tracking hoạt động (Frontend Demo)
            const newOrder = {
                id: response.data.order_id ? "FB" + response.data.order_id : "FB" + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString('vi-VN'),
                created_at: new Date().toISOString(),
                items: [...cart],
                total_price: finalTotalPrice,
                status: 'Pending', 
                shipping_address: address,
                payment_method: paymentMethod
            };

            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
            
            navigate('/tracking'); 
        }
    } catch (error) {
        console.error("Lỗi đặt hàng", error);
        toast.error("Lỗi khi xử lý đơn hàng, vui lòng thử lại sau!");
    } finally {
        setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-gray-50 min-h-screen px-6">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
        >
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-orange-100 flex flex-col items-center">
                <ShoppingBag size={100} strokeWidth={1} className="text-orange-200 mb-8" />
                <h2 className="text-3xl font-serif font-black text-gray-800 italic mb-4">Giỏ hàng rỗng</h2>
                <p className="text-gray-400 font-medium mb-10 text-center">Có vẻ như những đóa hoa xinh đẹp vẫn đang đợi bạn chọn đấy!</p>
                <button 
                    onClick={() => navigate('/products')} 
                    className="bg-orange-500 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-24 pb-40 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-20">
            <button onClick={() => navigate('/products')} className="bg-white p-4 rounded-full shadow-sm hover:text-orange-500 transition-all">
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic tracking-tight">Thanh toán đơn hàng</h1>
                <p className="text-gray-400 font-medium italic mt-2">Đoạn đường cuối để mang vẻ đẹp thiên nhiên đến nhà bạn</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50/50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                            <th className="pb-8 pl-4">Sản phẩm</th>
                            <th className="pb-8 text-center">Số lượng</th>
                            <th className="pb-8 text-right pr-4">Tạm tính</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {cart.map((item) => (
                            <tr key={item.id} className="group">
                                <td className="py-10 pl-4">
                                    <div className="flex items-center gap-8">
                                        <div className="relative w-28 h-28 rounded-[2rem] overflow-hidden shadow-inner flex-shrink-0">
                                            <img src={item.image || getFallbackImage(item.category_name, item.name)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-orange-500 transition-colors leading-tight mb-2 uppercase tracking-tight">{item.name}</h3>
                                            <p className="text-gray-400 font-bold text-sm">{item.price.toLocaleString('vi-VN')} đ / bó</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-rose-500 font-bold text-xs mt-4 flex items-center gap-1 hover:underline">
                                                <Trash2 size={14} /> Xóa
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-10 text-center">
                                    <div className="inline-flex items-center bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center hover:text-orange-500"><Minus size={16} /></button>
                                        <span className="w-10 text-center font-black">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center hover:text-orange-500"><Plus size={16} /></button>
                                    </div>
                                </td>
                                <td className="py-10 text-right pr-4">
                                    <span className="text-xl font-black text-gray-900">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Address Form */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50/50">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gray-900 text-white p-3 rounded-2xl"><Truck size={24} /></div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Thông tin giao hàng</h2>
                </div>
                <div className="space-y-6">
                    <div className="relative group">
                        <textarea 
                            className="w-full p-8 bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white outline-none rounded-[2rem] font-bold transition-all min-h-[150px]"
                            placeholder="Nhập địa chỉ nhận hoa chi tiết của bạn..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Gift Options */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50/50 mt-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-orange-500 text-white p-3 rounded-2xl"><Gift size={24} /></div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Dịch vụ giao hoa hộ & Lời nhắn</h2>
                </div>
                <div className="space-y-6">
                    <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${isGift ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:border-orange-200'}`}>
                        <input 
                            type="checkbox" 
                            checked={isGift}
                            onChange={(e) => setIsGift(e.target.checked)}
                            className="w-5 h-5 text-orange-500 focus:ring-orange-500 rounded" 
                        />
                        <span className="ml-4 font-bold text-gray-900">Giao hoa hộ và đính kèm lời nhắn (+{MESSAGE_FEE.toLocaleString('vi-VN')} đ)</span>
                    </label>

                    {isGift && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 pt-4"
                        >
                            <input 
                                type="text"
                                placeholder="Tên người gửi"
                                value={giftSender}
                                onChange={(e) => setGiftSender(e.target.value)}
                                className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white outline-none rounded-[1.5rem] font-bold transition-all"
                            />
                            <input 
                                type="text"
                                placeholder="Tên người nhận"
                                value={giftRecipient}
                                onChange={(e) => setGiftRecipient(e.target.value)}
                                className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white outline-none rounded-[1.5rem] font-bold transition-all"
                            />
                            <textarea 
                                placeholder="Lời nhắn gửi kèm..."
                                value={giftMessage}
                                onChange={(e) => setGiftMessage(e.target.value)}
                                className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white outline-none rounded-[1.5rem] font-bold transition-all min-h-[120px]"
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50/50 mt-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gray-900 text-white p-3 rounded-2xl"><CreditCard size={24} /></div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Phương thức thanh toán</h2>
                </div>
                
                <div className="space-y-4">
                    <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:border-orange-200'}`}>
                        <input 
                            type="radio" 
                            name="payment_method" 
                            value="COD" 
                            checked={paymentMethod === 'COD'} 
                            onChange={() => setPaymentMethod('COD')}
                            className="w-5 h-5 text-orange-500 focus:ring-orange-500" 
                        />
                        <span className="ml-4 font-bold text-gray-900">Thanh toán tiền mặt khi nhận hoa (COD)</span>
                    </label>

                    <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'BANK' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:border-orange-200'}`}>
                        <input 
                            type="radio" 
                            name="payment_method" 
                            value="BANK" 
                            checked={paymentMethod === 'BANK'} 
                            onChange={() => setPaymentMethod('BANK')}
                            className="w-5 h-5 text-orange-500 focus:ring-orange-500" 
                        />
                        <span className="ml-4 font-bold text-gray-900">Chuyển khoản ngân hàng</span>
                    </label>

                    {/* Bank Details Dropdown */}
                    {paymentMethod === 'BANK' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-8 items-center md:items-start"
                        >
                            <div className="flex-1 w-full">
                                <h3 className="font-black text-gray-900 mb-4">Thông tin chuyển khoản:</h3>
                                <p className="text-gray-600 font-medium mb-2">Ngân hàng: <span className="font-bold text-gray-900">MB Bank</span></p>
                                <p className="text-gray-600 font-medium mb-2">Số tài khoản: <span className="font-bold text-orange-500 text-lg">0379013019</span></p>
                                <p className="text-gray-600 font-medium mb-2">Chủ tài khoản: <span className="font-bold text-gray-900">PHAM HO HOANG ANH</span></p>
                                <p className="text-gray-600 font-medium mb-2">Số tiền: <span className="font-bold text-gray-900">{totalPrice.toLocaleString('vi-VN')} đ</span></p>
                                <div className="mt-4 p-4 bg-orange-100/50 text-orange-800 text-sm font-medium rounded-xl border border-orange-200">
                                    <p className="mb-2">Lưu ý: Bạn hãy <b>quét mã QR</b> bên cạnh để ứng dụng ngân hàng tự động điền đúng số tiền và thông tin nhé!</p>
                                    <p>Nội dung chuyển khoản: <span className="font-bold">Mã đơn hàng</span> hoặc <span className="font-bold">Số điện thoại</span> của bạn.</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 bg-white p-3 rounded-3xl shadow-xl shadow-orange-100 border border-white flex flex-col items-center">
                                <img 
                                    src={`https://img.vietqr.io/image/MB-0379013019-compact2.png?amount=${finalTotalPrice}&addInfo=Thanh toan flora ${encodeURIComponent(user?.name || 'Khach hang')}&accountName=PHAM HO HOANG ANH`} 
                                    alt="QR Code Thanh Toán" 
                                    className="w-56 h-auto rounded-xl object-contain drop-shadow-md"
                                />
                                <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mt-4 mb-2">Quét mã bằng app ngân hàng</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900 text-white rounded-[3.5rem] p-10 shadow-2xl sticky top-32">
                <h2 className="text-2xl font-black uppercase italic tracking-tight mb-10 pb-6 border-b border-white/10">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center opacity-60 font-bold uppercase text-xs tracking-widest">
                        <span>Tạm tính</span>
                        <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between items-center opacity-60 font-bold uppercase text-xs tracking-widest">
                        <span>Phí vận chuyển</span>
                        <span>{SHIPPING_FEE.toLocaleString('vi-VN')} đ</span>
                    </div>
                    {isGift && (
                        <div className="flex justify-between items-center opacity-60 font-bold uppercase text-xs tracking-widest text-orange-200">
                            <span>Phí lời nhắn</span>
                            <span>{MESSAGE_FEE.toLocaleString('vi-VN')} đ</span>
                        </div>
                    )}
                    <div className="h-[1px] bg-white/10" />
                    <div className="flex justify-between items-end">
                        <span className="font-black uppercase italic text-sm">Tổng cộng</span>
                        <div className="text-right">
                            <span className="text-4xl font-black text-orange-500 block">{finalTotalPrice.toLocaleString('vi-VN')}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Việt Nam Đồng</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <ShieldCheck size={16} className="text-orange-500" />
                        Bảo đảm hoa tươi trên 48h
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <CreditCard size={16} className="text-orange-500" />
                        Thanh toán bảo mật
                    </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                    loading ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-900/40'
                  }`}
                >
                    {loading ? 'Đang tạo đơn...' : 'Xác nhận đặt hoa'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

