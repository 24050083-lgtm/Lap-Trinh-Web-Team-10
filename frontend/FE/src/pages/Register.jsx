import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false); // Trạng thái chờ xử lý
  const { register } = useAuth();
  const navigate = useNavigate();

  // Cập nhật dữ liệu khi gõ vào ô input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm xử lý khi nhấn nút Đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setIsLoading(true); // Bắt đầu xử lý, khóa nút bấm

      // 2. Gọi hàm register (Thêm await để chờ kết quả từ AuthContext)
      const result = await register(formData); 

      if (result && result.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate('/login'); // Chuyển về trang đăng nhập
      } else {
        alert(result?.message || "Đăng ký thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Có lỗi xảy ra trong quá trình kết nối.");
    } finally {
      setIsLoading(false); // Xử lý xong, mở lại nút bấm
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-orange-600 uppercase tracking-wider">
          ĐĂNG KÝ THÀNH VIÊN
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Hoặc <Link to="/login" className="text-orange-500 font-bold hover:text-orange-700 underline">
            đã có tài khoản? Đăng nhập
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl border border-orange-100 sm:rounded-xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Họ và Tên */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Họ và Tên *</label>
              <input
                type="text" name="fullName" required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Số điện thoại *</label>
                <input
                  type="tel" name="phone" required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="090..."
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email" name="email"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Địa chỉ nhận hoa *</label>
              <input
                type="text" name="address" required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Số nhà, tên đường, quận/huyện..."
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mật khẩu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Mật khẩu *</label>
                <input
                  type="password" name="password" required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {/* Xác nhận mật khẩu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Xác nhận mật khẩu *</label>
                <input
                  type="password" name="confirmPassword" required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white transition-all duration-200 ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                }`}
              >
                {isLoading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐĂNG KÝ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;