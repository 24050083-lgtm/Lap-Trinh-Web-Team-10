import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { flowers as initialFlowers } from '../data/flowers';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/products/');
        let rawData = res.data;
        if (rawData.results) rawData = rawData.results;
        else if (rawData.data) rawData = rawData.data;

        const productsFromBE = Array.isArray(rawData) ? rawData.map(p => ({
          ...p,
          image: p.image && !p.image.startsWith('http') ? `http://127.0.0.1:8000${p.image}` : p.image
        })) : [];
        setFlowers(productsFromBE);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ từ BE:", error);
        const saved = localStorage.getItem('flora_managed_products');
        setFlowers(saved ? JSON.parse(saved) : initialFlowers);
      }
    };
    fetchHomeProducts();
  }, []);

  const featuredFlowers = flowers.slice(0, 8);

  const features = [
    { icon: <Truck size={30} />, title: "Giao hoa hoả tốc", desc: "Trong 60-120 phút nội thành" },
    { icon: <Star size={30} />, title: "Chất lượng 5 sao", desc: "Hoa tươi tuyển chọn mỗi ngày" },
    { icon: <Heart size={30} />, title: "Thiết kế tinh tế", desc: "Nghệ nhân cắm hoa chuyên nghiệp" },
    { icon: <Clock size={30} />, title: "Phục vụ 24/7", desc: "Hỗ trợ khách hàng tận tâm" },
  ];

  return (
    <div className="bg-white min-h-screen pb-40">
      <HeroBanner />
      {/* Features Section */}
      <section className="container mx-auto px-10 -mt-20 relative z-30 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, idx) => (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} key={idx} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-orange-100 border border-white flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
                    <div className="text-orange-500 mb-6 bg-orange-50 p-5 rounded-[1.5rem] group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">{item.icon}</div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">{item.title}</h3>
                    <p className="text-gray-400 font-medium text-sm italic">{item.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-10 mb-40">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 px-4">
          <div className="max-w-2xl">
            <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Best Sellers</span>
            <h2 className="text-4xl md:text-6xl font-serif font-black text-gray-900 italic leading-tight">MẪU HOA ĐƯỢC YÊU THÍCH NHẤT</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-4 bg-gray-900 text-white px-8 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all shadow-xl">
            Xem tất cả <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {featuredFlowers.map((flower) => (
            <ProductCard key={flower.id} flower={flower} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-10 mb-40">
        <div className="bg-gray-900 rounded-[5rem] overflow-hidden flex flex-col lg:flex-row h-full lg:h-[600px] shadow-2xl relative">
            <div className="w-full lg:w-1/2 p-20 flex flex-col justify-center relative z-10">
                <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Our Story</span>
                <h2 className="text-white text-5xl md:text-7xl font-serif font-black italic mb-8 leading-tight">Yêu thương trao trọn trong từng cánh hoa</h2>
                <Link to="/products" className="w-fit bg-white text-gray-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all">Về chúng tôi</Link>
            </div>
            <div className="w-full lg:w-1/2 relative h-[400px] lg:h-full">
                <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1500" className="w-full h-full object-cover" alt="About" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

