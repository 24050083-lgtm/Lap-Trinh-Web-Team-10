import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Flower2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl shadow-orange-100 border border-orange-50 overflow-hidden"
      >
        <div className="p-12 md:p-16">
            <div className="flex flex-col items-center mb-12">
                <div className="bg-orange-500 p-4 rounded-3xl shadow-xl shadow-orange-200 mb-6 rotate-3">
                    <Flower2 size={32} className="text-white" />
                </div>
                <h2 className="text-4xl font-serif font-black text-gray-900 italic mb-2 uppercase tracking-tight">Mừng bạn quay lại</h2>
                <p className="text-gray-400 font-medium italic">Tiếp tục hành trình cùng FLORA Boutique</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-6">Email của bạn</label>
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-100 focus:bg-white px-16 py-5 rounded-[1.8rem] outline-none font-bold transition-all"
                            placeholder="example@gmail.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-6">Mật khẩu</label>
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-100 focus:bg-white px-16 py-5 rounded-[1.8rem] outline-none font-bold transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="flex justify-end mt-2">
                        <Link to="/forgot-password" className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`group w-full py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl ${
                        isLoading ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-orange-500 text-white hover:bg-black shadow-orange-200 hover:shadow-gray-200'
                    }`}
                >
                    {isLoading ? "Đang xác thực..." : "Đăng nhập ngay"}
                    {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /> }
                </button>
            </form>

            <div className="mt-12 text-center">
                <p className="text-gray-400 font-medium italic">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-orange-500 font-black not-italic hover:underline underline-offset-4">
                        Đăng ký thành viên
                    </Link>
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

