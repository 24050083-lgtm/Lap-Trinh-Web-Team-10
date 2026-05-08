import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mail, Phone, KeyRound, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (method === 'email' && !email) return toast.error('Vui lòng nhập email');
    if (method === 'phone' && !phone) return toast.error('Vui lòng nhập số điện thoại');
    
    setIsLoading(true);
    try {
      const url = method === 'email' 
        ? 'http://127.0.0.1:8000/api/forgot-password/' 
        : 'http://127.0.0.1:8000/api/forgot-password-phone/';
      const payload = method === 'email' ? { email } : { phone };
      
      const res = await axios.post(url, payload);
      toast.success(res.data.message || 'Mã OTP đã được gửi');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) return toast.error('Vui lòng nhập mã OTP 4 số');

    setIsLoading(true);
    try {
      const url = method === 'email'
        ? 'http://127.0.0.1:8000/api/verify-otp/'
        : 'http://127.0.0.1:8000/api/verify-otp-phone/';
      const payload = method === 'email' ? { email, otp } : { phone, otp };

      const res = await axios.post(url, payload);
      toast.success(res.data.message || 'Xác thực thành công');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Mã OTP không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error('Vui lòng nhập đầy đủ thông tin');
    if (newPassword !== confirmPassword) return toast.error('Mật khẩu xác nhận không khớp');
    if (newPassword.length < 6) return toast.error('Mật khẩu phải có ít nhất 6 ký tự');

    setIsLoading(true);
    try {
      const url = method === 'email'
        ? 'http://127.0.0.1:8000/api/reset-password/'
        : 'http://127.0.0.1:8000/api/reset-password-phone/';
      const payload = method === 'email' 
        ? { email, otp, new_password: newPassword }
        : { phone, otp, new_password: newPassword };

      const res = await axios.post(url, payload);
      toast.success(res.data.message || 'Đổi mật khẩu thành công');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đổi mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Khôi phục mật khẩu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "Chọn phương thức và nhập thông tin để nhận mã OTP"}
            {step === 2 && `Mã xác nhận 4 số đã được gửi tới ${method === 'email' ? email : phone}`}
            {step === 3 && "Tạo mật khẩu mới cho tài khoản của bạn"}
          </p>
        </div>

        {/* BƯỚC 1: NHẬP THÔNG TIN */}
        {step === 1 && (
          <div>
            {/* Tab Phương thức */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${method === 'email' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setMethod('email')}
              >
                <Mail className="w-4 h-4" /> Email
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${method === 'phone' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setMethod('phone')}
              >
                <Phone className="w-4 h-4" /> SMS
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSendOTP}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {method === 'email' ? (
                      <Mail className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Phone className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type={method === 'email' ? "email" : "tel"}
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder={method === 'email' ? "Địa chỉ Email" : "Số điện thoại"}
                    value={method === 'email' ? email : phone}
                    onChange={(e) => method === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition-colors"
                >
                  {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center justify-center w-full"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại đăng nhập
                </button>
              </div>
            </form>
          </div>
        )}

        {/* BƯỚC 2: NHẬP OTP */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-lg text-center tracking-widest font-bold"
                  placeholder="----"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition-colors"
              >
                {isLoading ? 'Đang kiểm tra...' : 'Xác nhận OTP'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center w-full"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Đổi phương thức nhận mã
              </button>
            </div>
          </form>
        )}

        {/* BƯỚC 3: NHẬP MẬT KHẨU MỚI */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition-colors"
              >
                {isLoading ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
