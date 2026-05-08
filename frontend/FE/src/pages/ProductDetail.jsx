import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flowers as initialFlowers } from '../data/flowers';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [flower, setFlower] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
        let data = res.data.data || res.data;
        if (data.results) data = data.results[0] || data;
        if (data.image && !data.image.startsWith('http')) {
          data.image = `http://127.0.0.1:8000${data.image}`;
        }
        if (data.images && Array.isArray(data.images)) {
          data.images = data.images.map(img => ({
            ...img,
            image: img.image && !img.image.startsWith('http') ? `http://127.0.0.1:8000${img.image}` : img.image
          }));
        }
        setFlower(data);
        setSelectedImage(data.image);
      } catch (error) {
        console.error('Loi khi tai chi tiet san pham tu BE:', error);
        try {
          const saved = localStorage.getItem('flora_managed_products');
          const flowersList = saved ? JSON.parse(saved) : initialFlowers;
          const found = flowersList.find(f => f && f.id != null && f.id.toString() === id?.toString());
          setFlower(found !== undefined ? found : false);
          if (found) setSelectedImage(found.image);
        } catch (innerError) {
          const foundInitial = initialFlowers.find(f => f && f.id != null && f.id.toString() === id?.toString());
          setFlower(foundInitial !== undefined ? foundInitial : false);
          if (foundInitial) setSelectedImage(foundInitial.image);
        }
      }
      window.scrollTo(0, 0);
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (flower) {
      addToCart(flower, quantity);
      toast.success(`Đã thêm ${quantity} ${flower.name} vào giỏ!`);
    }
  };

  if (flower === false) return <div className="p-40 pt-60 text-center font-black uppercase tracking-widest text-red-500">KHÔNG TÌM THẤY SẢN PHẨM HOẶC SẢN PHẨM ĐÃ BỊ XÓA</div>;
  if (!flower) return <div className="p-40 pt-60 text-center font-black uppercase tracking-widest text-orange-500">Đang tìm hoa...</div>;

  const benefits = [
    { icon: <ShieldCheck className="text-emerald-500" />, title: 'Chất lượng bảo đảm', desc: 'Hoa tươi loại 1 nhập khẩu' },
    { icon: <Truck className="text-orange-500" />, title: 'Giao hàng hỏa tốc', desc: 'Giao ngay trong 2 giờ' },
    { icon: <Clock className="text-blue-500" />, title: 'Chăm sóc 24/7', desc: 'Tư vấn thiết kế miễn phí' },
  ];

  const galleryImages = [
    ...(flower.image ? [flower.image] : []),
    ...((flower.images || []).map(img => img.image).filter(Boolean))
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-40 px-6">
      <div className="container mx-auto max-w-7xl">
        <button onClick={() => navigate(-1)} className="mb-12 flex items-center gap-2 group text-gray-400 hover:text-orange-500 transition-colors font-black uppercase text-xs tracking-widest">
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
            {/* Main large image */}
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl bg-gray-50 aspect-[4/5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage || flower.image}
                  alt={flower.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1561181286-d3fea73e413f?q=80&w=800'; }}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    style={{ border: selectedImage === imgUrl ? '3px solid #f97316' : '3px solid #f3f4f6' }}
                    className="flex-shrink-0 w-20 h-20 rounded-[1.2rem] overflow-hidden transition-all duration-200 hover:scale-105"
                  >
                    <img
                      src={imgUrl}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </button>
                ))}
              </div>
            )}
            {galleryImages.length > 1 && (
              <p className="text-center text-xs text-gray-400 font-medium italic">
                {galleryImages.length} hình ảnh • Bấm để xem
              </p>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="bg-orange-50 text-orange-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest w-fit mb-6 shadow-sm">{flower.category_name || 'Mẫu mới'}</span>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-gray-900 mb-6 italic leading-tight">{flower.name}</h1>
            <p className="text-3xl font-black text-gray-900 mb-8 pb-8 border-b border-gray-100">{Number(flower.price || 0).toLocaleString('vi-VN')} <span className="text-sm italic">VNĐ</span></p>
            <p className="text-gray-500 text-lg leading-relaxed italic mb-12">{flower.description || 'Một tuyệt tác hoa tươi từ Flora Boutique, được chọn lựa kỹ lưỡng để mang đến cho bạn những cảm xúc trọn vẹn nhất.'}</p>

            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-[2rem] p-2 px-6 gap-6">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-orange-500 transition-colors"><RefreshCw size={20} className="rotate-180" /></button>
                <span className="text-xl font-black w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-orange-500 transition-colors"><RefreshCw size={20} /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-orange-500 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 group">
                <ShoppingCart size={22} className="group-hover:rotate-12 transition-transform" />
                Thêm vào giỏ hàng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
              {benefits.map((b, i) => (
                <div key={i} className="flex flex-col items-start">
                  <div className="mb-3">{b.icon}</div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">{b.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 italic leading-snug">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
