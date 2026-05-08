import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2000",
    subtitle: "Premium Flower Collective",
    title: "Nghệ Thuật Từ Cánh Hoa Tươi",
    color: "from-orange-500/20"
  },
  {
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=2000",
    subtitle: "Luxury Gift Sets",
    title: "Gửi Trao Trọn Vẹn Yêu Thương",
    color: "from-rose-500/20"
  },
  {
    image: "https://images.unsplash.com/photo-1519378304602-45a4216ec35d?q=80&w=2000",
    subtitle: "Special Occasion",
    title: "Khởi Đầu Ngày Mới Rạng Rỡ",
    color: "from-amber-500/20"
  }
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    <div className="relative w-full h-[500px] md:h-[750px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-linear scale-110" 
            style={{ backgroundImage: `url('${slides[current].image}')`, transform: 'scale(1.1)' }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].color} to-transparent tracking-tighter`} />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="relative z-20 h-full container mx-auto px-10 flex flex-col justify-center items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/30">
                {slides[current].subtitle}
              </span>
              <h2 className="text-white text-5xl md:text-8xl font-serif italic font-bold mb-10 leading-[1.1]">
                {slides[current].title}
              </h2>
              <div className="flex gap-6">
                <Link to="/products" className="group bg-orange-500 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-orange-500 transition-all shadow-2xl flex items-center gap-4">
                  Khám phá ngay
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="absolute bottom-12 right-12 z-30 flex gap-4">
        <button onClick={prevSlide} className="p-4 border border-white/30 text-white rounded-full hover:bg-orange-500 transition-all backdrop-blur-md">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="p-4 bg-orange-500 text-white rounded-full hover:bg-white hover:text-orange-500 transition-all shadow-xl">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-12 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 transition-all duration-500 rounded-full ${idx === current ? 'w-12 bg-orange-500' : 'w-3 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;