
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  Building2,
  User,
  Save
} from 'lucide-react';

type ConfigTab = 'finance-cat' | 'staff-levels' | 'specialties' | 'allocation-rules' | 'partner-management';

interface BaseItem {
  id: string;
  code: string;
  name: string;
  desc: string;
  status: 'Active' | 'Inactive';
  type?: string; // For finance categories and partners
  percentage?: number; // For allocation rules
  tax_code?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  payment_term?: string;
}

interface SystemConfigProps {
  forcedTabId?: string;
}

const SystemConfig: React.FC<SystemConfigProps> = ({ forcedTabId }) => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('finance-cat');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseItem | null>(null);

  // --- DATA STATES ---
  const [financeData, setFinanceData] = useState<BaseItem[]>([
    { id: 't1', code: 'T01', name: 'Doanh thu thực thu', type: 'Thu', desc: 'Nguồn thu từ hoạt động kinh doanh chính', status: 'Active' },
    { id: 't2', code: 'T02', name: 'Doanh thu tài chính', type: 'Thu', desc: 'Lãi ngân hàng, đầu tư', status: 'Active' },
    { id: 'c1', code: 'C01', name: 'Dịch vụ thuê ngoài', type: 'Chi', desc: 'Chi phí thuê outsource, Freelancer', status: 'Active' },
    { id: 'c2', code: 'C02', name: 'Lương & Thưởng', type: 'Chi', desc: 'Lương, thưởng, phụ cấp nhân sự', status: 'Active' },
    { id: 'c3', code: 'C03', name: 'Chi phí Marketing', type: 'Chi', desc: 'Quảng cáo, Event, Agency', status: 'Active' },
    { id: 'c4', code: 'C04', name: 'Văn phòng phẩm', type: 'Chi', desc: 'Dụng cụ văn phòng, in ấn', status: 'Active' },
    { id: 'c5', code: 'C05', name: 'Điện nước, Internet', type: 'Chi', desc: 'Chi phí vận hành văn phòng', status: 'Active' },
    { id: 'c6', code: 'C06', name: 'Công tác phí', type: 'Chi', desc: 'Di chuyển, lưu trú công tác', status: 'Active' },
    { id: 'c7', code: 'C07', name: 'Chi phí khác', type: 'Chi', desc: 'Các khoản chi phí phát sinh ngoài danh mục', status: 'Active' },
  ]);

  const [levelData, setLevelData] = useState<BaseItem[]>([
    { id: 'l1', code: 'L01', name: 'Nhân viên', desc: 'Nhân viên chính thức', status: 'Active' },
    { id: 'l2', code: 'L02', name: 'Trưởng phòng', desc: 'Quản lý cấp trung', status: 'Active' },
    { id: 'l3', code: 'L03', name: 'Giám đốc', desc: 'Ban lãnh đạo', status: 'Active' },
  ]);

  const [specialtyData, setSpecialtyData] = useState<BaseItem[]>([
    { id: 's1', code: 'S01', name: 'BA', desc: 'Business Analyst', status: 'Active' },
    { id: 's2', code: 'S02', name: 'Dev', desc: 'Developer', status: 'Active' },
    { id: 's3', code: 'S03', name: 'Design', desc: 'UI/UX Designer', status: 'Active' },
  ]);

  const [allocationData, setAllocationData] = useState<BaseItem[]>([
    { id: 'a1', code: 'BU-GNA', name: 'BlueBolt G&A', percentage: 17, desc: 'Quản lý chung', status: 'Active' },
    { id: 'a2', code: 'BU-RND', name: 'BlueBolt R&D', percentage: 14, desc: 'Nghiên cứu', status: 'Active' },
    { id: 'a3', code: 'BU-ACD', name: 'BlueBolt Academy', percentage: 13, desc: 'Đào tạo', status: 'Active' },
    { id: 'a4', code: 'BU-SVS', name: 'BlueBolt Services', percentage: 19, desc: 'Dịch vụ', status: 'Active' },
    { id: 'a5', code: 'BU-SFT', name: 'BlueBolt Software', percentage: 37, desc: 'Phần mềm', status: 'Active' },
  ]);

  const [partnerData, setPartnerData] = useState<BaseItem[]>([
    { 
      id: 'p1', 
      code: 'PAR-001', 
      name: 'Công ty Công nghệ Toàn Cầu', 
      type: 'Khách hàng', 
      tax_code: '0101234567', 
      contact_person: 'Nguyễn Văn Nam', 
      phone: '0901234567', 
      email: 'nam.nv@globaltech.vn',
      address: 'Thanh Xuân, Hà Nội',
      payment_term: 'Net 30',
      status: 'Active',
      desc: 'Đối tác chiến lược mảng phần mềm'
    },
    { 
      id: 'p2', 
      code: 'PAR-002', 
      name: 'Nhà cung cấp Thiết bị VP X', 
      type: 'Nhà cung cấp', 
      tax_code: '0309876543', 
      contact_person: 'Trần Thị Thu', 
      phone: '0988776655', 
      email: 'thu.tt@vpsupplier.com',
      address: 'Quận 1, TP.HCM',
      payment_term: 'COD',
      status: 'Active',
      desc: 'Cung cấp văn phòng phẩm và máy tính'
    },
  ]);

  // Form State
  const [formData, setFormData] = useState<Partial<BaseItem>>({});

  useEffect(() => {
    if (forcedTabId) setActiveTab(forcedTabId as ConfigTab);
  }, [forcedTabId]);

  const totalAllocation = useMemo(() => allocationData.reduce((sum, r) => sum + (r.percentage || 0), 0), [allocationData]);

  const getActiveData = () => {
    if (activeTab === 'finance-cat') return { data: financeData, setter: setFinanceData };
    if (activeTab === 'staff-levels') return { data: levelData, setter: setLevelData };
    if (activeTab === 'specialties') return { data: specialtyData, setter: setSpecialtyData };
    if (activeTab === 'partner-management') return { data: partnerData, setter: setPartnerData };
    return { data: allocationData, setter: setAllocationData };
  };

  const handleOpenModal = (item?: BaseItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        code: '',
        name: '',
        desc: '',
        status: 'Active',
        type: activeTab === 'finance-cat' ? 'Chi' : activeTab === 'partner-management' ? 'Khách hàng' : undefined,
        percentage: activeTab === 'allocation-rules' ? 0 : undefined,
        tax_code: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        payment_term: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const { data, setter } = getActiveData();

    if (editingItem) {
      setter(data.map(i => i.id === editingItem.id ? { ...i, ...formData } as BaseItem : i));
    } else {
      setter([{ id: Date.now().toString(), ...formData } as BaseItem, ...data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      const { data, setter } = getActiveData();
      setter(data.filter(i => i.id !== id));
    }
  };

  const tabLabels: Record<ConfigTab, string> = {
    'finance-cat': 'Danh mục thu/chi',
    'staff-levels': 'Cấp bậc nhân sự',
    'specialties': 'Chuyên môn / Vai trò',
    'allocation-rules': 'Quy tắc phân bổ',
    'partner-management': 'Quản lý đối tác'
  };

  const renderTableHead = () => (
    <thead className="bg-gray-50/50">
      <tr>
        <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-32">Mã định danh</th>
        <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tên hiển thị</th>
        {activeTab === 'finance-cat' && <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-32 text-center">Phân loại</th>}
        {activeTab === 'partner-management' && (
          <>
            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-40 text-center">Loại đối tác</th>
            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-40">Liên hệ chính</th>
          </>
        )}
        {activeTab === 'allocation-rules' && <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-40">Tỷ lệ (%)</th>}
        {activeTab !== 'partner-management' && <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mô tả nghiệp vụ</th>}
        <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-32">Trạng thái</th>
        <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-32 text-right">Thao tác</th>
      </tr>
    </thead>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        <div className="p-8 border-b border-gray-50 flex items-center justify-end flex-shrink-0">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Thêm mới dữ liệu</span>
          </button>
        </div>

        {activeTab === 'allocation-rules' && (
          <div className={`mx-8 mt-6 p-4 rounded-2xl flex items-center space-x-3 ${
            totalAllocation === 100 ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'
          }`}>
            {totalAllocation === 100 ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <div className="flex-1">
              <p className="text-sm font-bold">Tổng tỷ lệ hiện tại: {totalAllocation}%</p>
              <p className="text-[12px] opacity-80">{totalAllocation === 100 ? 'Cấu hình hợp lệ để tính P&L.' : 'Cảnh báo: Phải đạt chính xác 100%.'}</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {renderTableHead()}
            <tbody className="divide-y divide-gray-50">
              {getActiveData().data.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-black bg-gray-50 px-2.5 py-1.5 rounded-xl text-gray-600 border border-gray-100 shadow-sm">
                      {item.code}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-black text-gray-800">{item.name}</span>
                      {activeTab === 'partner-management' && item.tax_code && (
                        <span className="text-[11px] text-gray-400 font-bold uppercase">MST: {item.tax_code}</span>
                      )}
                    </div>
                  </td>
                  {(activeTab === 'finance-cat' || activeTab === 'partner-management') && (
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        (item.type === 'Thu' || item.type === 'Khách hàng') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                  )}
                  {activeTab === 'partner-management' && (
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700">{item.contact_person}</span>
                        <span className="text-[11px] text-gray-400">{item.phone}</span>
                      </div>
                    </td>
                  )}
                  {activeTab === 'allocation-rules' && (
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-blue-600 w-8">{item.percentage}%</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                          <div className="bg-blue-600 h-full" style={{width: `${item.percentage}%`}}></div>
                        </div>
                      </div>
                    </td>
                  )}
                  {activeTab !== 'partner-management' && (
                    <td className="px-8 py-5">
                      <span className="text-sm text-gray-400 font-medium line-clamp-1 italic">"{item.desc || '---'}"</span>
                    </td>
                  )}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                        {item.status === 'Active' ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">
                  {editingItem ? 'Cập nhật định nghĩa' : 'Thêm mới định nghĩa'}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Cấu hình: {tabLabels[activeTab]}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã định danh (Code)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="VD: C01, L01, PAR-001..."
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái áp dụng</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Active">Đang áp dụng</option>
                    <option value="Inactive">Tạm ngừng sử dụng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên hiển thị / Tên pháp nhân</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {activeTab === 'partner-management' && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Phân cấp đối tác</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Khách hàng">Khách hàng</option>
                        <option value="Nhà cung cấp">Nhà cung cấp</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã số thuế doanh nghiệp</label>
                      <input 
                        type="text" 
                        value={formData.tax_code}
                        onChange={(e) => setFormData({...formData, tax_code: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'finance-cat' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tính chất dòng tiền</label>
                  <div className="flex gap-4">
                    {['Thu', 'Chi'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, type})}
                        className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                          formData.type === type 
                          ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-50' 
                          : 'border-transparent bg-gray-50 text-gray-400'
                        }`}
                      >
                        Dòng {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'allocation-rules' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tỷ lệ phân bổ ngân sách (%)</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData({...formData, percentage: parseInt(e.target.value) || 0})}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ghi chú diễn giải nghiệp vụ</label>
                <textarea 
                  rows={2}
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all resize-none italic"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 px-6 border border-gray-100 rounded-[24px] text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 px-6 bg-blue-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Xác nhận lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfig;
