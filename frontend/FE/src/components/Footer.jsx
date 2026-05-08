import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Send, Flower2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 mt-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        {/* Brand Column */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Flower2 size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-serif font-black italic tracking-tight uppercase">Flora<span className="text-orange-500">Boutique</span></h2>
          </Link>
          <p className="text-gray-400 mb-8 leading-relaxed italic font-medium">
            Mang thiên nhiên vào ngôi nhà xinh đẹp của bạn. Chúng tôi tin rằng mỗi đóa hoa đều mang một sứ mệnh trao gửi yêu thương.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-orange-500 hover:text-white transition-all text-gray-400"><Facebook size={20}/></a>
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-orange-500 hover:text-white transition-all text-gray-400"><Instagram size={20}/></a>
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-orange-500 hover:text-white transition-all text-gray-400"><Youtube size={20}/></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/10 text-orange-500">Khám Phá</h3>
          <ul className="space-y-4 text-gray-400 font-bold text-sm italic">
            <li><Link to="/products" className="hover:text-orange-500 transition-colors">Tất cả sản phẩm</Link></li>
            <li><Link to="/products?category=Hoa Cưới" className="hover:text-orange-500 transition-colors">Hoa Cưới</Link></li>
            <li><Link to="/products?category=Hoa Chia Buồn" className="hover:text-orange-500 transition-colors">Hoa Chia Buồn</Link></li>
            <li><Link to="/tracking" className="hover:text-orange-500 transition-colors">Theo dõi đơn hàng</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/10 text-orange-500">Liên Hệ</h3>
          <ul className="space-y-6 text-gray-400 text-sm font-medium italic">
            <li className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-xl text-orange-500"><MapPin size={18}/></div>
              <span>Trường Đại Học Bình Dương, Thủ Dầu Một, Bình Dương</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl text-orange-500"><Phone size={18}/></div>
              <span>0123 456 789</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl text-orange-500"><Mail size={18}/></div>
              <span>contact@floraboutique.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/10 text-orange-500">Bản Tin</h3>
          <p className="text-gray-400 text-sm mb-6 font-medium italic">Đăng ký để nhận thông tin về các mẫu hoa mới nhất và ưu đãi đặc quyền.</p>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email của bạn..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:bg-white/10 focus:border-orange-500 outline-none transition-all placeholder:text-gray-600 font-bold"
            />
            <button className="absolute right-2 top-2 bg-orange-500 p-2 rounded-xl hover:bg-white hover:text-orange-500 transition-all shadow-xl">
              <Send size={20}/>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-10 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">
        <p>© 2026 FLORA BOUTIQUE. Mới quyền được bảo lưu.</p>
        <div className="flex gap-8">
          <span>Design by: DevTeam</span>
          <span className="text-orange-500/50 italic">Elegance in every petal</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

