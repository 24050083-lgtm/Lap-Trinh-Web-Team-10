import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFallbackImage } from '../utils/imageHelper';
import { toast } from 'react-hot-toast';

const ProductCard = ({ flower }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(flower);
    toast.success(`Đã thêm ${flower.name} vào giờ!`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(234,88,12,0.1)] transition-all duration-500 relative flex flex-col h-full"
    >
      {/* Image Section */}
      <div onClick={() => navigate(`/product/${flower.id}`)} className="relative aspect-[4/5] overflow-hidden m-3 rounded-[2rem] block cursor-pointer">
        <img 
          src={flower.image || getFallbackImage(flower.category_name, flower.name)} 
          alt={flower.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          onError={(e) => { e.target.src = getFallbackImage(flower.category_name, flower.name); }}
        />
        
        {/* Overlay Tools */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <span className="bg-white p-3 rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-all shadow-xl scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <Eye size={20} />
            </span>
            <button onClick={handleAddToCart} className="bg-white p-3 rounded-full text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-xl scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 z-10">
                <ShoppingCart size={20} />
            </button>
        </div>

        <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-sm border border-orange-100">
                {flower.category_name || "Mẫu mới"}
            </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 pt-2 flex flex-col flex-grow">
        <Link to={`/product/${flower.id}`}>
            <h3 className="text-xl font-serif font-black text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 mb-2 leading-tight">
                {flower.name}
            </h3>
        </Link>
        
        <div className="flex flex-col gap-4 mt-auto">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Giá bán</span>
                <span className="text-2xl font-black text-gray-900">
                    {Number(flower.price || 0).toLocaleString('vi-VN')} <span className="text-sm font-bold text-orange-500 italic">đ</span>
                </span>
            </div>
            <div className="flex gap-2">
                <Link 
                    to={`/product/${flower.id}`}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-orange-100 hover:text-orange-600 transition-all text-center flex items-center justify-center gap-2"
                >
                    <Eye size={14} />
                    Chi tiết
                </Link>
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddToCart}
                    className="flex-1 flex justify-center items-center gap-2 bg-gray-900 text-white py-3 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-orange-500 transition-all shadow-lg group/btn"
                >
                    <ShoppingCart size={14} className="group-hover/btn:rotate-12 transition-transform" />
                    Thêm
                </motion.button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
