import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, Upload, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', imageFile: null, imagePreview: '', description: '',
    extraFiles: [], extraPreviews: []
  });

  // Tải dữ liệu từ Backend
  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/products/'),
        axios.get('http://127.0.0.1:8000/api/categories/')
      ]);
      
      let prodData = prodRes.data.results || prodRes.data.data || prodRes.data;
      let catData = catRes.data.results || catRes.data.data || catRes.data;
      
      const formatted = Array.isArray(prodData) ? prodData.map(p => ({
        ...p,
        image: p.image && !p.image.startsWith('http') ? `http://127.0.0.1:8000${p.image}` : p.image
      })) : [];
      
      setProducts(formatted);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu:', err);
      toast.error('Không thể kết nối đến máy chủ Backend!');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ 
        name: product.name || '', 
        price: product.price ? Number(product.price) : '', 
        category: product.category || (categories[0]?.id || ''), 
        imageFile: null,
        imagePreview: product.image || '', 
        description: product.description || '',
        extraFiles: [],
        extraPreviews: (product.images || []).map(img =>
          img.image && !img.image.startsWith('http') ? `http://127.0.0.1:8000${img.image}` : img.image
        )
      });
    } else {
      setEditingProduct(null);
      setFormData({ 
        name: '', price: '', 
        category: categories.length > 0 ? categories[0].id : '', 
        imageFile: null, imagePreview: '', description: '',
        extraFiles: [], extraPreviews: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => URL.createObjectURL(f));
    setFormData({ ...formData, extraFiles: files, extraPreviews: previews });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đủ: Tên, Giá và Danh mục!');
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Giá tiền không hợp lệ!');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', priceNum);
    data.append('category', formData.category);
    data.append('description', formData.description || '');
    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }
    // Đính kèm các ảnh phụ (nhiều ảnh)
    formData.extraFiles.forEach(file => {
      data.append('uploaded_images', file);
    });

    try {
      if (editingProduct) {
        await axios.patch(`http://127.0.0.1:8000/api/products/${editingProduct.id}/`, data);
        toast.success('Đã cập nhật sản phẩm vào Database!');
      } else {
        if (!formData.imageFile) {
          toast.error('Bạn chưa chọn hình ảnh đại diện sản phẩm!');
          setLoading(false);
          return;
        }
        await axios.post('http://127.0.0.1:8000/api/products/', data);
        toast.success('Đã thêm hoa mới vào Database!');
      }
      closeModal();
      loadData();
    } catch (err) {
      console.error(err.response || err);
      const errMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Thử lại sau.';
      toast.error(`Có lỗi xảy ra: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa sản phẩm khỏi Database, toàn bộ sẽ được cập nhật. Bạn chắc chắn chứ?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`);
        toast.success('Đã xóa sản phẩm khỏi hệ thống.');
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        toast.error('Lỗi khi xóa dữ liệu!');
      }
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-40 px-6 font-sans">
      <div className="container mx-auto max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Store Admin</span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic">Quản lý kho hoa</h1>
            <p className="text-sm font-bold text-gray-400 mt-2 italic">* Dữ liệu được đồng bộ trực tiếp với Máy chủ</p>
          </div>
          <button onClick={() => openModal()} className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all shadow-xl flex items-center gap-3">
            <Plus size={18} /> Thêm hoa mới
          </button>
        </header>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-12 flex items-center gap-4 px-10 border border-gray-100">
          <Search className="text-gray-300" size={20} />
          <input type="text" placeholder="Tìm tên hoa hoặc danh mục..." className="flex-1 bg-transparent outline-none font-bold text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                  <th className="p-10">Sản phẩm</th>
                  <th className="p-10">Phân loại</th>
                  <th className="p-10">Ảnh phụ</th>
                  <th className="p-10">Đơn giá</th>
                  <th className="p-10 text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="p-10 whitespace-nowrap">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-inner flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1561181286-d3fea73e413f?q=80&w=300'; }} />
                        </div>
                        <div>
                          <span className="font-black text-gray-900 text-lg uppercase tracking-tight block">{product.name}</span>
                          <span className="text-xs text-gray-400 font-medium">ID: {product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-10">
                      <span className="px-5 py-2 bg-orange-50 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-full">{product.category_name || 'Mẫu mới'}</span>
                    </td>
                    <td className="p-10">
                      <div className="flex items-center gap-2">
                        {(product.images || []).slice(0, 3).map((img, idx) => (
                          <div key={idx} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow">
                            <img src={img.image && !img.image.startsWith('http') ? `http://127.0.0.1:8000${img.image}` : img.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                        ))}
                        {(product.images || []).length > 3 && (
                          <span className="text-xs font-black text-gray-400">+{product.images.length - 3}</span>
                        )}
                        {(product.images || []).length === 0 && (
                          <span className="text-xs text-gray-300 font-medium italic">Chưa có ảnh phụ</span>
                        )}
                      </div>
                    </td>
                    <td className="p-10 font-black text-xl text-gray-800">{Number(product.price).toLocaleString('vi-VN')} đ</td>
                    <td className="p-10 text-right space-x-3">
                      <button onClick={() => openModal(product)} className="p-4 bg-gray-50 rounded-2xl hover:bg-orange-500 hover:text-white transition-all text-gray-400"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-4 bg-gray-50 rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-gray-400"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/20">
                <h2 className="text-3xl font-serif font-black italic">{editingProduct ? 'Cập nhật Database' : 'Thêm hoa vào Database'}</h2>
                <button onClick={closeModal} className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSave} className="p-10 pt-6 space-y-8 overflow-y-auto">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-6 tracking-widest">Tên bó hoa</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white p-5 rounded-[1.8rem] font-bold outline-none transition-all" placeholder="Ví dụ: Hồng Đỏ Ecuador" />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-6 tracking-widest">Giá tiền (VNĐ)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white p-5 rounded-[1.8rem] font-bold outline-none transition-all" placeholder="500000" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-6 tracking-widest">Danh mục DB</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white p-5 rounded-[1.8rem] font-bold outline-none transition-all cursor-pointer">
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Ảnh đại diện */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-6 tracking-widest">Ảnh đại diện</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-50 rounded-[1.5rem] overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <Upload className="text-gray-300" size={24} />
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-gray-50 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-orange-500 file:transition-all cursor-pointer rounded-2xl" />
                  </div>
                </div>

                {/* Nhiều ảnh phụ */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-6 tracking-widest flex items-center gap-2">
                    <Images size={12} /> Ảnh phụ (có thể chọn nhiều ảnh cùng lúc)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleExtraImagesChange} 
                    className="w-full bg-gray-50 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-gray-900 file:transition-all cursor-pointer rounded-2xl"
                  />
                  {formData.extraPreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {formData.extraPreviews.map((prev, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-100 shadow">
                          <img src={prev} alt={`Extra ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {editingProduct && (formData.extraPreviews.length > 0) && formData.extraFiles.length === 0 && (
                    <p className="text-xs text-gray-400 italic ml-2">Ảnh phụ hiện tại. Chọn file mới để thay thế tất cả.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-6 tracking-widest">Mô tả ngắn</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-200 focus:bg-white p-6 rounded-[2.5rem] font-medium italic outline-none transition-all min-h-[120px]" placeholder="Nhập chi tiết về hoa này..." />
                </div>

                <button type="submit" disabled={loading} className={`w-full py-6 text-white rounded-[2.2rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 text-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-black'}`}>
                  {loading ? 'Đang thực thi...' : <><Save size={20} /> Lưu vào Database</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProduct;
