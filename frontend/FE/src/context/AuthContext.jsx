import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usersDb, setUsersDb] = useState([]);

  useEffect(() => {
    // 1. Tải thông tin user đang đăng nhập
    const savedUser = localStorage.getItem('flora_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('flora_user');
      }
    }

    // 2. Quản lý danh sách User giả lập
    const loadUsers = () => {
      let storedUsers = [];
      try {
        storedUsers = JSON.parse(localStorage.getItem('usersDb') || '[]');
      } catch (e) {
        storedUsers = [];
      }

      const adminAccount = { email: 'admin@gmail.com', password: '123', role: 1, name: 'Admin Flora' };
      const testAccount = { email: 'user@gmail.com', password: '123', role: 0, name: 'Khách hàng' };

      // Đảm bảo luôn có admin trong danh sách
      if (!storedUsers.some(u => u.email === adminAccount.email)) {
        storedUsers.push(adminAccount);
      }

      // Đảm bảo luôn có user test trong danh sách
      if (!storedUsers.some(u => u.email === testAccount.email)) {
        storedUsers.push(testAccount);
      }

      localStorage.setItem('usersDb', JSON.stringify(storedUsers));
      setUsersDb(storedUsers);
    };

    loadUsers();
  }, []);

  const login = (email, password) => {
    // Tìm kiếm trực tiếp trong localStorage để đảm bảo dữ liệu mới nhất
    const latestUsers = JSON.parse(localStorage.getItem('usersDb') || '[]');
    const foundUser = latestUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData = { email: foundUser.email, role: foundUser.role, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('flora_user', JSON.stringify(userData));
      toast.success(`Chào mừng Quản trị viên, ${foundUser.name}!`);
      return { success: true };
    }

    toast.error('Email hoặc mật khẩu không đúng!');
    return { success: false };
  };

  const register = (formData) => {
    const { fullName, email, password } = formData;
    const latestUsers = JSON.parse(localStorage.getItem('usersDb') || '[]');

    if (latestUsers.some(u => u.email === email)) {
      toast.error('Email này đã tồn tại!');
      return { success: false };
    }

    const newUser = { name: fullName, email, password, role: 0 };
    const updatedDb = [...latestUsers, newUser];
    localStorage.setItem('usersDb', JSON.stringify(updatedDb));
    setUsersDb(updatedDb);
    toast.success('Đăng ký thành công!');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flora_user');
    toast.success('Đã đăng xuất.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);