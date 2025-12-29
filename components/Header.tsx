
import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  // Lời chào thay đổi theo tiêu đề hoặc mặc định
  const getSubtitle = () => {
    if (title === 'Tổng quan') return 'Xin chào! Đây là tình hình hoạt động hôm nay.';
    return `Quản lý dữ liệu hệ thống cho ${title.toLowerCase()}.`;
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{getSubtitle()}</p>
      </div>

      <div className="flex items-center space-x-8">
        <div className="hidden lg:flex items-center bg-[#F8F9FB] px-4 py-2 rounded-2xl border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all w-80">
          <Search size={18} className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Tìm kiếm thông tin..." 
            className="bg-transparent border-none outline-none text-[14px] w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <User size={20} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900">Admin</p>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">Hệ thống</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
