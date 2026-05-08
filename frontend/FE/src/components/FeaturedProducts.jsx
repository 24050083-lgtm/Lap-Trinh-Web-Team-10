import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { flowers as backupProducts } from '../data/flowers'; // Import từ file data

const FeaturedProducts = () => {
  const [products, setProducts] = useState(backupProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { if (data.length > 0) setProducts(data); })
      .catch(() => console.log("Đang dùng dữ liệu flowers.js"));
  }, []);

  const categories = ["All", ...new Set(products.map(item => item.category_name).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category_name === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          {/* Thanh lọc & tìm kiếm giữ nguyên */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              flower={product}  /* ĐỔI TỪ product={product} THÀNH flower={product} */
              onAddToCart={(id) => alert(`Đã thêm hoa ID ${id} vào giỏ!`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;