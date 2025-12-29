
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Filter,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Briefcase,
  UserCheck,
  UserMinus,
  Clock,
  UserPlus,
  ArrowUpRight,
  // Fix: Added missing Activity icon import
  Activity
} from 'lucide-react';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  business_unit: string;
  specialization: string;
  level: string;
  join_date: string;
  work_status: 'Working' | 'Probation' | 'Resigned';
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', employee_id: 'BB-001', full_name: 'Nguyễn Thế Vinh', business_unit: 'BlueBolt Software', specialization: 'Fullstack Dev', level: 'Senior', join_date: '2023-01-15', work_status: 'Working' },
  { id: '2', employee_id: 'BB-002', full_name: 'Lê Thị Thu Thảo', business_unit: 'BlueBolt Services', specialization: 'Business Analyst', level: 'Senior', join_date: '2023-02-10', work_status: 'Working' },
  { id: '3', employee_id: 'BB-003', full_name: 'Trần Minh Hoàng', business_unit: 'BlueBolt R&D', specialization: 'AI Researcher', level: 'Expert', join_date: '2023-05-20', work_status: 'Working' },
  { id: '4', employee_id: 'BB-004', full_name: 'Phạm Hồng Anh', business_unit: 'BlueBolt Software', specialization: 'QA/QC', level: 'Middle', join_date: '2023-08-01', work_status: 'Probation' },
  { id: '5', employee_id: 'BB-005', full_name: 'Đặng Quang Huy', business_unit: 'BlueBolt Academy', specialization: 'Trainer', level: 'Senior', join_date: '2023-09-12', work_status: 'Working' },
  { id: '6', employee_id: 'BB-006', full_name: 'Vũ Minh Đức', business_unit: 'BlueBolt G&A', specialization: 'Accountant', level: 'Manager', join_date: '2023-01-01', work_status: 'Working' },
  { id: '7', employee_id: 'BB-007', full_name: 'Hoàng Kim Ngân', business_unit: 'BlueBolt Services', specialization: 'Customer Success', level: 'Junior', join_date: '2024-01-05', work_status: 'Probation' },
  { id: '8', employee_id: 'BB-008', full_name: 'Lý Quốc Việt', business_unit: 'BlueBolt Software', specialization: 'Frontend Dev', level: 'Middle', join_date: '2023-04-15', work_status: 'Working' },
  { id: '9', employee_id: 'BB-009', full_name: 'Trịnh Công Sơn', business_unit: 'BlueBolt R&D', specialization: 'Data Scientist', level: 'Senior', join_date: '2023-11-20', work_status: 'Working' },
  { id: '10', employee_id: 'BB-010', full_name: 'Ngô Mỹ Linh', business_unit: 'BlueBolt Workspace', specialization: 'Admin', level: 'Junior', join_date: '2024-02-15', work_status: 'Probation' },
  { id: '11', employee_id: 'BB-011', full_name: 'Phan Văn Trị', business_unit: 'BlueBolt Software', specialization: 'Backend Dev', level: 'Senior', join_date: '2022-12-10', work_status: 'Working' },
  { id: '12', employee_id: 'BB-012', full_name: 'Bùi Thị Xuân', business_unit: 'BlueBolt Services', specialization: 'Sales Executive', level: 'Middle', join_date: '2023-06-01', work_status: 'Resigned' },
  { id: '13', employee_id: 'BB-013', full_name: 'Đoàn Ngọc Hải', business_unit: 'BlueBolt Academy', specialization: 'Media Specialist', level: 'Junior', join_date: '2023-07-20', work_status: 'Working' },
  { id: '14', employee_id: 'BB-014', full_name: 'Lâm Khánh Chi', business_unit: 'BlueBolt G&A', specialization: 'HR Generalist', level: 'Middle', join_date: '2023-10-05', work_status: 'Working' },
  { id: '15', employee_id: 'BB-015', full_name: 'Thạch Sanh', business_unit: 'BlueBolt Software', specialization: 'DevOps', level: 'Senior', join_date: '2023-03-30', work_status: 'Working' },
];

const SPECIALIZATIONS = ['BA', 'Dev', 'QA/QC', 'PM', 'Design', 'Data', 'AI', 'HR', 'Accountant', 'Sales', 'Trainer'];
const BUS = ['BlueBolt Software', 'BlueBolt Services', 'BlueBolt R&D', 'BlueBolt Academy', 'BlueBolt G&A', 'BlueBolt Workspace'];

const StatCard = ({ title, value, icon, color, trend }: any) => (
  <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-xl font-black text-gray-900 mt-0.5">{value}</h3>
      </div>
    </div>
    {trend && (
      <div className="flex items-center text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={12} className="mr-0.5" />
        {trend}%
      </div>
    )}
  </div>
);

const HRManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBU, setFilterBU] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<Partial<Employee>>({});

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: employees.length,
      working: employees.filter(e => e.work_status === 'Working').length,
      probation: employees.filter(e => e.work_status === 'Probation').length,
      resigned: employees.filter(e => e.work_status === 'Resigned').length
    };
  }, [employees]);

  // Filter Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBU = filterBU === '' || emp.business_unit === filterBU;
      const matchSpec = filterSpec === '' || emp.specialization.includes(filterSpec);
      const matchStatus = filterStatus === '' || emp.work_status === filterStatus;
      
      return matchSearch && matchBU && matchSpec && matchStatus;
    });
  }, [employees, searchTerm, filterBU, filterSpec, filterStatus]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedData = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData(emp);
    } else {
      setEditingEmployee(null);
      setFormData({
        employee_id: `BB-${Math.floor(100 + Math.random() * 900)}`,
        full_name: '',
        business_unit: BUS[0],
        specialization: SPECIALIZATIONS[0],
        level: 'Junior',
        join_date: new Date().toISOString().split('T')[0],
        work_status: 'Probation'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(employees.map(ev => ev.id === editingEmployee.id ? { ...ev, ...formData } as Employee : ev));
    } else {
      setEmployees([{ id: Date.now().toString(), ...formData } as Employee, ...employees]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Working':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg border border-green-100"><UserCheck size={12}/> Đang làm việc</span>;
      case 'Probation':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-lg border border-blue-100"><Clock size={12}/> Thử việc</span>;
      case 'Resigned':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase rounded-lg border border-gray-100"><UserMinus size={12}/> Nghỉ việc</span>;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng nhân sự" value={stats.total} icon={<Users className="text-blue-600"/>} color="bg-blue-50" trend={5} />
        <StatCard title="Đang làm việc" value={stats.working} icon={<UserCheck className="text-green-600"/>} color="bg-green-50" />
        <StatCard title="Thử việc" value={stats.probation} icon={<Clock className="text-orange-600"/>} color="bg-orange-50" />
        <StatCard title="Đã nghỉ việc" value={stats.resigned} icon={<UserMinus className="text-gray-400"/>} color="bg-gray-100" />
      </div>

      {/* SEARCH & FILTER CONSOLIDATED BAR */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên (Tên hoặc Mã NV)..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 shrink-0"
          >
            <UserPlus size={18} />
            <span>Thêm nhân viên</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-50">
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-blue-200">
            <Filter size={14} className="text-gray-400 mr-2" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-3">Đơn vị</span>
            <select 
              value={filterBU}
              onChange={(e) => setFilterBU(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 cursor-pointer min-w-[130px]"
            >
              <option value="">Tất cả BU</option>
              {BUS.map(bu => <option key={bu} value={bu}>{bu}</option>)}
            </select>
          </div>

          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-blue-200">
            <Briefcase size={14} className="text-gray-400 mr-2" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-3">Chuyên môn</span>
            <select 
              value={filterSpec}
              onChange={(e) => setFilterSpec(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 cursor-pointer min-w-[110px]"
            >
              <option value="">Tất cả</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-blue-200">
            <Activity size={14} className="text-gray-400 mr-2" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-3">Trạng thái</span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 cursor-pointer min-w-[130px]"
            >
              <option value="">Tất cả</option>
              <option value="Working">Đang làm việc</option>
              <option value="Probation">Thử việc</option>
              <option value="Resigned">Nghỉ việc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">Mã NV</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ và tên</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đơn vị (BU)</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chuyên môn / Vị trí</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ngày vào làm</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.length > 0 ? paginatedData.map((emp) => (
                <tr key={emp.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold bg-gray-50 text-gray-500 border border-gray-100 px-2.5 py-1.5 rounded-xl">
                      {emp.employee_id}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-sm border border-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {emp.full_name.split(' ').pop()?.charAt(0)}
                      </div>
                      <span className="text-[14px] font-bold text-gray-800">{emp.full_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Briefcase size={14} className="text-gray-300" />
                      <span className="text-sm font-bold text-gray-600">{emp.business_unit}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">{emp.specialization}</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider mt-0.5">{emp.level}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-medium text-gray-500 italic">
                      {new Date(emp.join_date).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {getStatusBadge(emp.work_status)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenModal(emp)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(emp.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                      <button className="p-2.5 text-gray-300 hover:text-gray-600 rounded-xl transition-all"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Users size={64} strokeWidth={1} className="mb-4 text-gray-300" />
                      <p className="font-black text-gray-400 uppercase tracking-widest text-sm italic">Không tìm thấy nhân viên nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/20">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Hiển thị <span className="text-gray-900 font-black">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-gray-900 font-black">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> trên <span className="text-gray-900 font-black">{filteredEmployees.length}</span> nhân sự
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-colors shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-110' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-colors shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">
                  {editingEmployee ? 'Cập nhật hồ sơ' : 'Thêm Nhân viên Mới'}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Thông tin định danh nhân sự BLUEBOLT Engine</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-400 transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã nhân viên</label>
                  <input 
                    required
                    type="text" 
                    value={formData.employee_id}
                    onChange={(e) => setFormData({...formData, employee_id: e.target.value.toUpperCase()})}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên đầy đủ</label>
                  <input 
                    required
                    type="text" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="VD: Nguyễn Thế Vinh"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Đơn vị (BU) Trực thuộc</label>
                  <select 
                    value={formData.business_unit}
                    onChange={(e) => setFormData({...formData, business_unit: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    {BUS.map(bu => <option key={bu} value={bu}>{bu}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Chuyên môn / Vị trí</label>
                  <select 
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Cấp bậc (Level)</label>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl outline-none text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
                    <option value="Expert">Expert</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày gia nhập</label>
                  <input 
                    type="date" 
                    value={formData.join_date}
                    onChange={(e) => setFormData({...formData, join_date: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl outline-none text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái làm việc</label>
                  <select 
                    value={formData.work_status}
                    onChange={(e) => setFormData({...formData, work_status: e.target.value as any})}
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl outline-none text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="Working">Đang làm việc</option>
                    <option value="Probation">Thử việc</option>
                    <option value="Resigned">Nghỉ việc</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-10 sticky bottom-0 bg-white">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 px-6 border border-gray-100 rounded-[24px] text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 px-6 bg-blue-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  {editingEmployee ? 'Lưu hồ sơ' : 'Xác nhận khởi tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRManagement;
