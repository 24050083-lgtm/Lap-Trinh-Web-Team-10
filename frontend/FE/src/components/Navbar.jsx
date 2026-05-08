import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Flower2, User, LogOut, Settings, Menu, X, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Cửa hàng', path: '/products' },
    { name: 'Theo dõi đơn', path: '/tracking' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 bg-white/80 backdrop-blur-xl shadow-lg' : 'py-8 bg-transparent'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-orange-200">
              <Flower2 className="text-white" size={24} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">Flora<span className="text-orange-500 italic">Boutique</span></span>
              <span className="text-[8px] font-bold text-gray-400 tracking-[0.3em] uppercase">Vườn hoa nghệ thuật</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-black uppercase tracking-widest transition-all hover:text-orange-500 ${
                  location.pathname === link.path ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Admin Dashboard Link */}
            {user?.role === 1 && (
              <Link 
                to="/admin" 
                className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-gray-200"
              >
                <LayoutDashboard size={16} />
                Quản trị
              </Link>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:text-orange-500 hover:border-orange-100 transition-all shadow-sm"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Chào,</span>
                  <span className="text-xs font-black text-gray-900">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-gray-200"
              >
                <User size={18} />
                Đăng nhập
              </Link>
            )}

            <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
