
import React, { useState } from 'react';
import { 
  UserPlus, 
  Plus,
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  Key, 
  Eye, 
  Shield, 
  ShieldCheck,
  Clock, 
  History, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Smartphone,
  Globe,
  Monitor,
  Check,
  User as UserIcon,
  ShieldAlert,
  Save
} from 'lucide-react';

type AdminTab = 'user-management' | 'role-permissions' | 'audit-logs' | 'security-settings';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Locked';
  lastLogin: string;
  createdAt: string;
}

const MOCK_USERS: User[] = [
  { id: 'U001', name: 'Nguyễn Văn Admin', email: 'admin@bluebolt.vn', role: 'Admin', status: 'Active', lastLogin: '2024-03-20 14:30', createdAt: '2023-01-01' },
  { id: 'U002', name: 'Lê Thị CFO', email: 'cfo@bluebolt.vn', role: 'CFO', status: 'Active', lastLogin: '2024-03-20 10:15', createdAt: '2023-01-15' },
  { id: 'U003', name: 'Trần Kế Toán', email: 'accountant1@bluebolt.vn', role: 'Accountant', status: 'Active', lastLogin: '2024-03-19 16:45', createdAt: '2023-03-10' },
  { id: 'U004', name: 'Phạm Nhân Sự', email: 'hr@bluebolt.vn', role: 'HR', status: 'Locked', lastLogin: '2024-02-28 09:00', createdAt: '2023-05-20' },
];

const MOCK_ROLES = [
  { id: 'r1', name: 'Admin', desc: 'Quản trị toàn quyền hệ thống', userCount: 2 },
  { id: 'r2', name: 'CFO', desc: 'Giám đốc tài chính - Phê duyệt chi phí', userCount: 1 },
  { id: 'r3', name: 'Accountant', desc: 'Kế toán viên - Nhập liệu thu chi', userCount: 5 },
  { id: 'r4', name: 'HR', desc: 'Quản lý nhân sự và cấp bậc', userCount: 3 },
];

const MODULES = [
  { id: 'm1', name: 'Nhân sự' },
  { id: 'm2', name: 'Chấm công' },
  { id: 'm3', name: 'Lương' },
  { id: 'm4', name: 'Thu chi' },
  { id: 'm5', name: 'Báo cáo' },
  { id: 'm6', name: 'Cấu hình' },
];

const ACTIONS = ['Xem', 'Tạo', 'Sửa', 'Xóa', 'Phê duyệt'];

const MOCK_LOGS = [
  { time: '2024-03-20 15:45:12', user: 'admin@bluebolt.vn', action: 'Xóa phiếu chi', module: 'Thu chi', target: 'PC-1002', status: 'Success' },
  { time: '2024-03-20 15:40:05', user: 'hr@bluebolt.vn', action: 'Sửa bảng lương', module: 'Lương', target: 'Tháng 03/2024', status: 'Success' },
  { time: '2024-03-20 15:35:55', user: 'admin@bluebolt.vn', action: 'Thay đổi quyền', module: 'Quản trị', target: 'Accountant Role', status: 'Success' },
  { time: '2024-03-20 15:30:22', user: 'unknown_ip', action: 'Đăng nhập thất bại', module: 'Auth', target: 'admin@bluebolt.vn', status: 'Failed' },
];

interface SystemAdminProps {
  forcedTabId?: string;
}

const SystemAdmin: React.FC<SystemAdminProps> = ({ forcedTabId }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>((forcedTabId as AdminTab) || 'user-management');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Sync tab with props from sidebar
  React.useEffect(() => {
    if (forcedTabId) setActiveTab(forcedTabId as AdminTab);
  }, [forcedTabId]);

  const handleOpenDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleOpenEdit = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setModalMode('edit');
    } else {
      setSelectedUser(null);
      setModalMode('create');
    }
    setIsEditModalOpen(true);
  };

  const renderUserManagement = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100">
            <Filter size={18} />
            <span>Lọc</span>
          </button>
          <button 
            onClick={() => handleOpenEdit()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <UserPlus size={18} />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Vai trò</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Đăng nhập cuối</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/20 transition-all group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs border border-blue-50">
                      {user.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-800">{user.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-black uppercase rounded-lg">
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <p className="text-xs font-bold text-gray-500">{user.lastLogin}</p>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => handleOpenDetail(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100"
                    >
                      <Key size={16} />
                    </button>
                    <button className={`p-2 rounded-xl transition-all border border-gray-100 ${
                      user.status === 'Active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                    }`}>
                      {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRolePermissions = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Danh sách vai trò</h3>
            <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
              <Plus size={18} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_ROLES.map((role) => (
              <button key={role.id} className="w-full text-left p-6 hover:bg-gray-50 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{role.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{role.desc}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">{role.userCount} người dùng</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight italic">Ma trận phân quyền</h3>
              <p className="text-xs text-gray-400">Đang cấu hình cho: <span className="font-bold text-blue-600 uppercase tracking-widest">Accountant</span></p>
            </div>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">
              Lưu thay đổi
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Module hệ thống</th>
                  {ACTIONS.map(action => (
                    <th key={action} className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">{action}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MODULES.map((module) => (
                  <tr key={module.id} className="hover:bg-blue-50/20 transition-all">
                    <td className="px-8 py-5 text-sm font-bold text-gray-700">{module.name}</td>
                    {ACTIONS.map(action => {
                      const isChecked = Math.random() > 0.4;
                      return (
                        <td key={action} className="px-4 py-5 text-center">
                          <label className="relative inline-flex items-center cursor-pointer justify-center">
                            <input type="checkbox" className="sr-only peer" defaultChecked={isChecked} />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo người thực hiện, đối tượng..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-500 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100">
            <option>Tất cả Module</option>
            {MODULES.map(m => <option key={m.id}>{m.name}</option>)}
          </select>
          <select className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-500 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100">
            <option>Khoảng thời gian</option>
            <option>Hôm nay</option>
            <option>Tuần này</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm">
             Xuất báo cáo (Excel)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Người thực hiện</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Hành động</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_LOGS.map((log, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-8 py-5">
                  <span className="text-xs font-mono font-bold text-gray-400">{log.time}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-black">
                      {log.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{log.user}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-gray-800">{log.action}</span>
                  <p className="text-[10px] text-gray-400">{log.module}: <span className="font-mono text-blue-600">{log.target}</span></p>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Lock size={20} />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Chính sách mật khẩu</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Độ dài tối thiểu</p>
              <p className="text-xs text-gray-400">Yêu cầu người dùng đặt mật khẩu dài</p>
            </div>
            <input type="number" defaultValue={8} className="w-16 px-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Ký tự đặc biệt</p>
              <p className="text-xs text-gray-400">Bắt buộc chứa @, #, $, %...</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Clock size={20} />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Phiên làm việc</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Thời gian Timeout (Phút)</p>
              <p className="text-xs text-gray-400">Tự động thoát sau khoảng rảnh</p>
            </div>
            <input type="number" defaultValue={30} className="w-16 px-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 min-h-[70vh]">
      {/* Main Content Area */}
      {activeTab === 'user-management' && renderUserManagement()}
      {activeTab === 'role-permissions' && renderRolePermissions()}
      {activeTab === 'audit-logs' && renderAuditLogs()}
      {activeTab === 'security-settings' && renderSecuritySettings()}

      {/* DETAIL MODAL (CENTERED) */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck size={24} className="text-blue-600"/>
                  Chi tiết tài khoản
                </h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[40px] flex items-center justify-center font-black text-4xl border border-blue-100 shadow-sm relative">
                  {selectedUser.name.split(' ').pop()?.charAt(0)}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-800">{selectedUser.name}</h4>
                  <p className="text-sm font-medium text-gray-400 italic">{selectedUser.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-100">
                      {selectedUser.role}
                    </span>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      selectedUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Ngày tham gia</p>
                  <p className="text-sm font-bold text-gray-700">{selectedUser.createdAt}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Xác thực 2FA</p>
                  <p className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                    <Check size={14} strokeWidth={3} /> Đã bật bảo mật
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest border-b border-gray-50 pb-2">
                  <History size={16} />
                  <span>Lịch sử truy cập</span>
                </div>
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro - Chrome', ip: '118.70.1.25', time: 'Vừa xong', os: <Monitor size={14}/> },
                    { device: 'iPhone 15 Pro - Safari', ip: '118.70.1.25', time: '2 giờ trước', os: <Smartphone size={14}/> },
                    { device: 'Windows PC - Edge', ip: '1.54.33.10', time: 'Hôm qua, 18:20', os: <Monitor size={14}/> },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400">{h.os}</div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">{h.device}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{h.ip}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button className="flex-1 py-4 px-6 bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-100 transition-all">
                  Gửi yêu cầu đổi mật khẩu
                </button>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="flex-1 py-4 px-6 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL (CENTERED) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  {modalMode === 'create' ? 'Tạo tài khoản mới' : 'Chỉnh sửa thông tin'}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                  <input 
                    type="text" 
                    defaultValue={selectedUser?.name || ''}
                    placeholder="VD: Nguyễn Thế Vinh"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email / Username</label>
                  <input 
                    type="email" 
                    defaultValue={selectedUser?.email || ''}
                    placeholder="vinh.nt@bluebolt.vn"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Vai trò hệ thống</label>
                  <select 
                    defaultValue={selectedUser?.role || 'Accountant'}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                  >
                    <option value="Admin">Admin (Quản trị tổng)</option>
                    <option value="CFO">CFO (Giám đốc tài chính)</option>
                    <option value="Accountant">Accountant (Kế toán)</option>
                    <option value="HR">HR (Nhân sự)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái tài khoản</label>
                  <select 
                    defaultValue={selectedUser?.status || 'Active'}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                  >
                    <option value="Active">Hoạt động (Active)</option>
                    <option value="Locked">Tạm khóa (Locked)</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center gap-4">
                <ShieldAlert className="text-amber-500 shrink-0" size={24}/>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Lưu ý: Sau khi khởi tạo, mật khẩu tạm thời sẽ được gửi trực tiếp đến email cá nhân của người dùng. Tài khoản sẽ bắt buộc phải đổi mật khẩu và bật 2FA ở lần đăng nhập đầu tiên.
                </p>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-5 px-6 border border-gray-100 rounded-3xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-widest"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="button"
                  className="flex-1 py-5 px-6 bg-blue-600 text-white rounded-3xl text-sm font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Save size={18}/>
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdmin;
