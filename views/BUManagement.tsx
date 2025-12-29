
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  MoreVertical,
  Filter,
  Users,
  Calendar
} from 'lucide-react';

interface BusinessUnit {
  id: string;
  code: string;
  name: string;
  leader: string;
  startDate: string;
  employees: number;
  status: 'active' | 'inactive';
}

const INITIAL_DATA: BusinessUnit[] = [
  { id: '1', code: 'BU-SVS', name: 'BlueBolt Services', leader: 'Nguyễn Văn A', startDate: '2023-01-15', employees: 45, status: 'active' },
  { id: '2', code: 'BU-SFT', name: 'BlueBolt Software', leader: 'Trần Thị B', startDate: '2023-03-10', employees: 32, status: 'active' },
  { id: '3', code: 'BU-ACD', name: 'BlueBolt Academy', leader: 'Lê Văn C', startDate: '2023-06-20', employees: 15, status: 'active' },
  { id: '4', code: 'BU-WSP', name: 'BlueBolt Workspace', leader: 'Phạm Minh D', startDate: '2024-01-05', employees: 20, status: 'inactive' },
  { id: '5', code: 'BU-GNA', name: 'BlueBolt G&A', leader: 'Hoàng Anh E', startDate: '2023-01-01', employees: 12, status: 'active' },
  { id: '6', code: 'BU-RND', name: 'BlueBolt R&D', leader: 'Đặng Quang F', startDate: '2023-08-15', employees: 25, status: 'active' },
];

const BUManagement: React.FC = () => {
  const [bus, setBus] = useState<BusinessUnit[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBU, setEditingBU] = useState<BusinessUnit | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<BusinessUnit>>({
    code: '',
    name: '',
    leader: '',
    startDate: '',
    employees: 0,
    status: 'active'
  });

  const filteredBUs = useMemo(() => {
    return bus.filter(bu => 
      bu.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bu.leader.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bus, searchTerm]);

  const handleOpenModal = (bu?: BusinessUnit) => {
    if (bu) {
      setEditingBU(bu);
      setFormData(bu);
    } else {
      setEditingBU(null);
      setFormData({
        code: `BU-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        leader: '',
        startDate: new Date().toISOString().split('T')[0],
        employees: 0,
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBU(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBU) {
      setBus(bus.map(b => b.id === editingBU.id ? { ...b, ...formData } as BusinessUnit : b));
    } else {
      const newBU: BusinessUnit = {
        id: Date.now().toString(),
        ...formData
      } as BusinessUnit;
      setBus([newBU, ...bus]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn vị này không?')) {
      setBus(bus.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Toolbar */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, mã hoặc leader..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Tạo mới BU</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mã BU</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Đơn vị kinh doanh</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Người phụ trách</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Nhân sự</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBUs.length > 0 ? filteredBUs.map((bu) => (
                <tr key={bu.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-600">
                      {bu.code}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-[15px] font-bold text-gray-900">{bu.name}</p>
                    <div className="flex items-center mt-1 text-gray-400 text-xs">
                      <Calendar size={12} className="mr-1" />
                      Ngày lập: {new Date(bu.startDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mr-3 border border-blue-100">
                        {bu.leader.split(' ').pop()?.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{bu.leader}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-gray-50 rounded-full text-gray-600 font-bold text-xs">
                      <Users size={12} className="mr-1.5" />
                      {bu.employees}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tight ${
                      bu.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {bu.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(bu)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(bu.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Search size={48} className="text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium italic">Không tìm thấy đơn vị nào phù hợp...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  {editingBU ? 'Chỉnh sửa BU' : 'Tạo mới Đơn vị'}
                </h3>
                <p className="text-gray-400 text-sm mt-1">Vui lòng điền đầy đủ thông tin bên dưới.</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mã BU</label>
                  <input 
                    required
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Trạng thái</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Tên đơn vị</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ví dụ: BlueBolt Software"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Người phụ trách (Leader)</label>
                <input 
                  required
                  type="text" 
                  value={formData.leader}
                  onChange={(e) => setFormData({...formData, leader: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Ngày thành lập</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Số lượng nhân sự</label>
                  <input 
                    type="number" 
                    value={formData.employees}
                    onChange={(e) => setFormData({...formData, employees: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 py-4 px-6 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  {editingBU ? 'Lưu thay đổi' : 'Xác nhận tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BUManagement;
