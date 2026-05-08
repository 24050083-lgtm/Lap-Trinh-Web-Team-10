import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth(); // Lấy thông tin user hiện tại từ Context

  // State quản lý thông tin (Giả sử dữ liệu ban đầu lấy từ user context)
  const [userInfo, setUserInfo] = useState({
    fullName: user?.fullName || "Chưa có dữ liệu",
    email: user?.email || "ndinh0932014@gmail.com",
    dob: "Chưa có dữ liệu",
    gender: "Nam",
    phone: "Chưa có dữ liệu",
    address: "Chưa có dữ liệu"
  });

  // Hàm giả lập khi nhấn "Thay đổi"
  const handleEdit = (field) => {
    const newValue = prompt(`Nhập ${field} mới:`);
    if (newValue) {
      setUserInfo({ ...userInfo, [field]: newValue });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Thông tin tài khoản</h1>

      {/* Phần Thông tin tài khoản */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Thông tin tài khoản</h2>
        
        <div className="space-y-6 border-t border-gray-100 pt-4">
          {/* Ảnh đại diện */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-32">Ảnh đại diện</span>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold">
                {userInfo.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <button className="text-gray-400 hover:text-orange-500 text-sm">Thay ảnh đại diện</button>
          </div>

          {/* Họ tên */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-32">Họ tên</span>
              <span className={userInfo.fullName === "Chưa có dữ liệu" ? "text-gray-300" : "text-gray-800"}>
                {userInfo.fullName}
              </span>
            </div>
            <button onClick={() => handleEdit('fullName')} className="text-gray-400 hover:text-orange-500 text-sm">Thay đổi</button>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-32">Email</span>
              <span className="text-gray-800">{userInfo.email}</span>
            </div>
            <button className="text-gray-400 hover:text-orange-500 text-sm">Thay đổi</button>
          </div>

          {/* Mật khẩu */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-32">Mật khẩu</span>
              <span className="text-gray-800">**********</span>
            </div>
            <button className="text-gray-400 hover:text-orange-500 text-sm">Thay đổi</button>
          </div>
        </div>
      </section>

      {/* Phần Thông tin cá nhân */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cá nhân</h2>
        
        <div className="space-y-6 border-t border-gray-100 pt-4">
          {/* Ngày sinh */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-32">Ngày sinh</span>
              <span className="text-gray-300">{userInfo.dob}</span>
            </div>
            <button onClick={() => handleEdit('dob')} className="text-gray-400 hover:text-orange-500 text-sm">Thay đổi</button>
          </div>

          {/* Giới tính */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-32">Giới tính</span>
              <span className="text-gray-800">{userInfo.gender}</span>
            </div>
            <button onClick={() => handleEdit('gender')} className="text-gray-400 hover:text-orange-500 text-sm">Thay đổi</button>
          </div>

          {/* Số điện thoại */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-40">Số điện thoại cá nhân</span>
              <span className="text-gray-300">{userInfo.phone}</span>
            </div>
            <button onClick={() => handleEdit('phone')} className="text-gray-400 hover:text-orange-500 text-sm">Thay đổi</button>
          </div>

          {/* Địa chỉ */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-32">Địa chỉ</span>
              <span className="text-gray-300">{userInfo.address}</span>
            </div>
            <button onClick={() => handleEdit('address')} className="text-gray-400 hover:text-orange-500 text-sm">Thay đổi</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;