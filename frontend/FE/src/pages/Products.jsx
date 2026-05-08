import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Loader2, SearchX, Search } from 'lucide-react'; 
import { flowers as initialFlowers } from '../data/flowers';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const CATEGORIES = ["Tất cả", "Hoa Hồng", "Hoa Cưới", "Hoa Sinh Nhật", "Hoa Khai Trương", "Hoa Chia Buồn", "Hoa Lan", "Hoa Baby"];

const Products = () => {
  const [flowers, setFlowers] = useState([]);
  const [filteredFlowers, setFilteredFlowers] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get('search');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/products/');
        
        let rawData = res.data;
        if (rawData.results) rawData = rawData.results;
        else if (rawData.data) rawData = rawData.data;

        // Cập nhật URL ảnh (nếu cần đổi từ đường dẫn tương đối sang tuyệt đối)
        const productsFromBE = Array.isArray(rawData) ? rawData.map(p => ({
          ...p,
          image: p.image && !p.image.startsWith('http') ? `http://127.0.0.1:8000${p.image}` : p.image
        })) : [];
        
        setFlowers(productsFromBE);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ BE:", error);
        // Fallback về localStorage nếu BE lỗi
        const savedProducts = localStorage.getItem('flora_managed_products');
        const data = savedProducts ? JSON.parse(savedProducts) : initialFlowers;
        setFlowers(data);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadProducts();

    // Lắng nghe sự kiện thay đổi của localStorage từ tab khác (nếu có)
    window.addEventListener('storage', loadProducts);
    return () => window.removeEventListener('storage', loadProducts);
  }, []);

  useEffect(() => {
    let result = flowers;
    if (activeCategory !== "Tất cả") {
      result = flowers.filter(f => (f.category_name?.toLowerCase() === activeCategory.toLowerCase() || f.category === activeCategory));
    }
    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredFlowers(result);
  }, [activeCategory, flowers, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchTerm}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 min-h-screen">
        <Loader2 className="animate-spin text-orange-500" size={60}/>
        <p className="text-gray-400 font-black mt-8 uppercase tracking-[0.3em] text-sm italic">Đang cập nhật cửa hàng...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gray-50 pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gray-200 pb-12">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-gray-900 mb-6 italic">
                        {searchQuery ? `Kết quả: "${searchQuery}"` : "Cửa hàng Hoa Tươi"}
                    </h1>
                </div>
                
                <form onSubmit={handleSearch} className="relative w-full max-w-md">
                    <input 
                        type="text" 
                        placeholder="Tìm mẫu hoa bạn yêu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border-2 border-transparent shadow-sm px-8 py-5 rounded-[2rem] outline-none focus:border-orange-500/30 transition-all font-bold"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded-2xl hover:bg-black transition-all">
                        <Search size={20} />
                    </button>
                </form>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-8 py-3.5 rounded-full text-sm font-black transition-all ${
                        activeCategory === cat 
                        ? 'bg-orange-500 text-white shadow-xl shadow-orange-100' 
                        : 'bg-white text-gray-400 border border-transparent shadow-sm'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 max-w-7xl">
        {filteredFlowers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredFlowers.map((flower) => (
                <ProductCard key={flower.id} flower={flower} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40">
              <SearchX size={100} strokeWidth={1} className="text-orange-200 mb-8" />
              <button onClick={() => { setActiveCategory("Tất cả"); navigate('/products'); }} className="bg-orange-500 text-white px-12 py-5 rounded-full font-black uppercase shadow-2xl">
                  Quay lại Cửa hàng
              </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;


