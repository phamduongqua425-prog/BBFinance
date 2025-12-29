
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Eye,
  Building2,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  ArrowUpRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

interface Transaction {
  id: string;
  tx_code: string;
  tx_date: string;
  type: 'Thu' | 'Chi';
  category_code: string;
  category_name: string;
  subject_type: 'Partner' | 'Employee';
  subject_id: string;
  subject_name: string;
  payment_method: string;
  business_unit: string;
  amount: number;
  allocation_type: 'Direct' | 'Indirect';
  allocation_rule?: string;
  documents_count: number;
  status: 'Paid' | 'Unpaid';
  description: string;
}

const FINANCE_CATEGORIES = [
  { code: 'T01', name: 'Doanh thu thực thu', type: 'Thu' },
  { code: 'T02', name: 'Doanh thu tài chính', type: 'Thu' },
  { code: 'T03', name: 'Thu khác', type: 'Thu' },
  { code: 'C01', name: 'Dịch vụ thuê ngoài', type: 'Chi' },
  { code: 'C02', name: 'Lương & Thưởng', type: 'Chi' },
  { code: 'C03', name: 'Chi phí Marketing', type: 'Chi' },
  { code: 'C04', name: 'Văn phòng phẩm', type: 'Chi' },
  { code: 'C05', name: 'Điện nước, Internet', type: 'Chi' },
  { code: 'C06', name: 'Công tác phí', type: 'Chi' },
  { code: 'C07', name: 'Chi phí khác', type: 'Chi' },
];

const MOCK_PARTNERS = [
  { id: 'p1', name: 'Công ty Công nghệ Toàn Cầu', code: 'PAR-001' },
  { id: 'p2', name: 'Nhà cung cấp Thiết bị VP X', code: 'PAR-002' },
  { id: 'p3', name: 'Agency Quảng cáo ABC', code: 'PAR-003' },
  { id: 'p4', name: 'Tập đoàn viễn thông Blue', code: 'PAR-004' }
];

const MOCK_EMPLOYEES = [
  { id: 'BB-001', name: 'Nguyễn Thế Vinh', code: 'BB-001' },
  { id: 'BB-002', name: 'Lê Thị Thu Thảo', code: 'BB-002' },
  { id: 'BB-003', name: 'Trần Minh Hoàng', code: 'BB-003' },
  { id: 'BB-004', name: 'Phạm Hồng Anh', code: 'BB-004' }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  // --- THÁNG 3/2024 ---
  { id: '1', tx_code: 'PT-1001', tx_date: '2024-03-20', type: 'Thu', category_code: 'T01', category_name: 'Doanh thu thực thu', subject_type: 'Partner', subject_id: 'p1', subject_name: 'Công ty Toàn Cầu', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Software', amount: 155000000, allocation_type: 'Direct', documents_count: 2, status: 'Paid', description: 'Thanh toán đợt 1 dự án ERP' },
  { id: '2', tx_code: 'PC-2001', tx_date: '2024-03-19', type: 'Chi', category_code: 'C01', category_name: 'Dịch vụ thuê ngoài', subject_type: 'Partner', subject_id: 'p2', subject_name: 'Thiết bị VP X', payment_method: 'Tiền mặt', business_unit: 'BlueBolt G&A', amount: 12450000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Mua sắm văn phòng phẩm quý 1' },
  { id: '3', tx_code: 'PC-2002', tx_date: '2024-03-18', type: 'Chi', category_code: 'C02', category_name: 'Lương & Thưởng', subject_type: 'Employee', subject_id: 'BB-001', subject_name: 'Nguyễn Thế Vinh', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Software', amount: 28000000, allocation_type: 'Direct', documents_count: 0, status: 'Unpaid', description: 'Tạm ứng lương tháng 3' },
  { id: '4', tx_code: 'PC-2003', tx_date: '2024-03-17', type: 'Chi', category_code: 'C03', category_name: 'Chi phí Marketing', subject_type: 'Partner', subject_id: 'p3', subject_name: 'Agency Quảng cáo ABC', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Services', amount: 42000000, allocation_type: 'Indirect', allocation_rule: 'Standard 2024', documents_count: 3, status: 'Paid', description: 'Chi phí Facebook Ads tháng 3' },
  { id: '5', tx_code: 'PT-1002', tx_date: '2024-03-15', type: 'Thu', category_code: 'T02', category_name: 'Doanh thu tài chính', subject_type: 'Partner', subject_id: 'p4', subject_name: 'Tập đoàn Blue', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt G&A', amount: 12000000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Lãi tiền gửi tiết kiệm ngân hàng' },
  { id: '6', tx_code: 'PC-2004', tx_date: '2024-03-12', type: 'Chi', category_code: 'C05', category_name: 'Điện nước, Internet', subject_type: 'Partner', subject_id: 'p2', subject_name: 'Thiết bị VP X', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt G&A', amount: 8500000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Thanh toán tiền điện nước VP' },
  { id: '7', tx_code: 'PC-2005', tx_date: '2024-03-10', type: 'Chi', category_code: 'C06', category_name: 'Công tác phí', subject_type: 'Employee', subject_id: 'BB-003', subject_name: 'Trần Minh Hoàng', payment_method: 'Tiền mặt', business_unit: 'BlueBolt R&D', amount: 5600000, allocation_type: 'Direct', documents_count: 4, status: 'Paid', description: 'Hoàn ứng công tác phí Đà Nẵng' },

  // --- THÁNG 2/2024 ---
  { id: '8', tx_code: 'PT-1003', tx_date: '2024-02-28', type: 'Thu', category_code: 'T01', category_name: 'Doanh thu thực thu', subject_type: 'Partner', subject_id: 'p1', subject_name: 'Công ty Toàn Cầu', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Software', amount: 210000000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Nghiệm thu dự án Mobile App' },
  { id: '9', tx_code: 'PC-2006', tx_date: '2024-02-25', type: 'Chi', category_code: 'C02', category_name: 'Lương & Thưởng', subject_type: 'Employee', subject_id: 'BB-002', subject_name: 'Lê Thị Thu Thảo', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Services', amount: 35000000, allocation_type: 'Direct', documents_count: 0, status: 'Paid', description: 'Quyết toán lương tháng 2' },
  { id: '10', tx_code: 'PC-2007', tx_date: '2024-02-20', type: 'Chi', category_code: 'C04', category_name: 'Văn phòng phẩm', subject_type: 'Partner', subject_id: 'p2', subject_name: 'Thiết bị VP X', payment_method: 'Tiền mặt', business_unit: 'BlueBolt Academy', amount: 2300000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Mua giấy in và mực máy photocopy' },
  { id: '11', tx_code: 'PC-2008', tx_date: '2024-02-15', type: 'Chi', category_code: 'C03', category_name: 'Chi phí Marketing', subject_type: 'Partner', subject_id: 'p3', subject_name: 'Agency Quảng cáo ABC', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Services', amount: 15000000, allocation_type: 'Direct', documents_count: 2, status: 'Paid', description: 'Chi phí in ấn Standee sự kiện' },
  { id: '12', tx_code: 'PT-1004', tx_date: '2024-02-10', type: 'Thu', category_code: 'T03', category_name: 'Thu khác', subject_type: 'Partner', subject_id: 'p4', subject_name: 'Tập đoàn Blue', payment_method: 'Tiền mặt', business_unit: 'BlueBolt G&A', amount: 4500000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Thanh lý bàn ghế cũ VP' },
  { id: '13', tx_code: 'PC-2009', tx_date: '2024-02-05', type: 'Chi', category_code: 'C07', category_name: 'Chi phí khác', subject_type: 'Employee', subject_id: 'BB-004', subject_name: 'Phạm Hồng Anh', payment_method: 'Tiền mặt', business_unit: 'BlueBolt G&A', amount: 1200000, allocation_type: 'Direct', documents_count: 0, status: 'Paid', description: 'Chi phí tiếp khách đoàn liên ngành' },

  // --- THÁNG 1/2024 ---
  { id: '14', tx_code: 'PT-1005', tx_date: '2024-01-30', type: 'Thu', category_code: 'T01', category_name: 'Doanh thu thực thu', subject_type: 'Partner', subject_id: 'p1', subject_name: 'Công ty Toàn Cầu', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Software', amount: 180000000, allocation_type: 'Direct', documents_count: 2, status: 'Paid', description: 'Duy trì hệ thống Cloud tháng 1' },
  { id: '15', tx_code: 'PC-2010', tx_date: '2024-01-25', type: 'Chi', category_code: 'C01', category_name: 'Dịch vụ thuê ngoài', subject_type: 'Partner', subject_id: 'p3', subject_name: 'Agency Quảng cáo ABC', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt R&D', amount: 55000000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Thuê Server chạy AI Model' },
  { id: '16', tx_code: 'PC-2011', tx_date: '2024-01-20', type: 'Chi', category_code: 'C02', category_name: 'Lương & Thưởng', subject_type: 'Employee', subject_id: 'BB-001', subject_name: 'Nguyễn Thế Vinh', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Software', amount: 95000000, allocation_type: 'Direct', documents_count: 0, status: 'Paid', description: 'Thưởng KPI dự án năm 2023' },
  { id: '17', tx_code: 'PC-2012', tx_date: '2024-01-15', type: 'Chi', category_code: 'C05', category_name: 'Điện nước, Internet', subject_type: 'Partner', subject_id: 'p2', subject_name: 'Thiết thiết bị VP X', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt G&A', amount: 7200000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Tiền Internet 12 tháng đóng trước' },
  { id: '18', tx_code: 'PC-2013', tx_date: '2024-01-10', type: 'Chi', category_code: 'C06', category_name: 'Công tác phí', subject_type: 'Employee', subject_id: 'BB-002', subject_name: 'Lê Thị Thu Thảo', payment_method: 'Tiền mặt', business_unit: 'BlueBolt Services', amount: 3200000, allocation_type: 'Direct', documents_count: 2, status: 'Paid', description: 'Vé máy bay gặp gỡ đối tác HN' },
  { id: '19', tx_code: 'PT-1006', tx_date: '2024-01-05', type: 'Thu', category_code: 'T01', category_name: 'Doanh thu thực thu', subject_type: 'Partner', subject_id: 'p4', subject_name: 'Tập đoàn Blue', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Academy', amount: 45000000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Khóa học đào tạo DevOps K01' },
  { id: '20', tx_code: 'PC-2014', tx_date: '2024-01-02', type: 'Chi', category_code: 'C03', category_name: 'Chi phí Marketing', subject_type: 'Partner', subject_id: 'p3', subject_name: 'Agency Quảng cáo ABC', payment_method: 'Chuyển khoản', business_unit: 'BlueBolt Software', amount: 12000000, allocation_type: 'Direct', documents_count: 1, status: 'Paid', description: 'Chi phí SEO Website quý 1' },
  { id: '21', tx_code: 'PC-2015', tx_date: '2024-03-22', type: 'Chi', category_code: 'C07', category_name: 'Chi phí khác', subject_type: 'Employee', subject_id: 'BB-004', subject_name: 'Phạm Hồng Anh', payment_method: 'Tiền mặt', business_unit: 'BlueBolt Software', amount: 1500000, allocation_type: 'Direct', documents_count: 0, status: 'Unpaid', description: 'Mua hoa tặng đối tác sinh nhật' },
];

const BUS = ['BlueBolt Software', 'BlueBolt Services', 'BlueBolt R&D', 'BlueBolt Academy', 'BlueBolt G&A'];

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
    {trend !== undefined && (
      <div className={`flex items-center text-[10px] font-bold ${trend >= 0 ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg`}>
        {trend >= 0 ? <ArrowUpRight size={12} className="mr-0.5" /> : <ChevronDown size={12} className="mr-0.5" />}
        {Math.abs(trend)}%
      </div>
    )}
  </div>
);

const FinanceManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [modalType, setModalType] = useState<'Thu' | 'Chi'>('Thu');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('Tháng này');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filterBU, setFilterBU] = useState('Tất cả BU');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Thu' | 'Chi'>('All');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.tx_code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'All' || t.type === typeFilter;
      const matchBU = filterBU === 'Tất cả BU' || t.business_unit === filterBU;
      const matchStatus = filterStatus === 'Tất cả' || (filterStatus === 'Đã thanh toán' ? t.status === 'Paid' : t.status === 'Unpaid');
      
      let matchTime = true;
      if (timeRange === 'Tùy chọn' && customStartDate && customEndDate) {
        const d = new Date(t.tx_date);
        matchTime = d >= new Date(customStartDate) && d <= new Date(customEndDate);
      } else if (timeRange === 'Tháng này') {
        const d = new Date(t.tx_date);
        matchTime = d.getMonth() === 2 && d.getFullYear() === 2024; // March 2024
      } else if (timeRange === 'Quý này') {
        const d = new Date(t.tx_date);
        matchTime = d.getMonth() >= 0 && d.getMonth() <= 2 && d.getFullYear() === 2024; // Q1 2024
      }

      return matchSearch && matchType && matchBU && matchStatus && matchTime;
    });
  }, [transactions, searchTerm, typeFilter, filterBU, filterStatus, timeRange, customStartDate, customEndDate]);

  const totals = useMemo(() => {
    const thu = filteredTransactions.filter(t => t.type === 'Thu').reduce((acc, curr) => acc + curr.amount, 0);
    const chi = filteredTransactions.filter(t => t.type === 'Chi').reduce((acc, curr) => acc + curr.amount, 0);
    const net = thu - chi;
    const pending = filteredTransactions.filter(t => t.status === 'Unpaid').length;
    return { thu, chi, net, pending };
  }, [filteredTransactions]);

  const handleOpenCreate = (type: 'Thu' | 'Chi') => {
    const defaultCat = FINANCE_CATEGORIES.find(c => c.type === type);
    setModalMode('create');
    setModalType(type);
    setFormData({
      tx_date: new Date().toISOString().split('T')[0],
      type: type,
      category_code: defaultCat?.code || '',
      category_name: defaultCat?.name || '',
      tx_code: `${type === 'Thu' ? 'PT' : 'PC'}-${Math.floor(1000 + Math.random() * 9000)}`,
      subject_type: 'Partner',
      allocation_type: 'Direct',
      status: 'Unpaid',
      amount: 0,
      documents_count: 0,
      business_unit: BUS[0],
      payment_method: 'Chuyển khoản'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setModalMode('edit');
    setModalType(tx.type);
    setFormData(tx);
    setIsModalOpen(true);
  };

  const handleOpenView = (tx: Transaction) => {
    setModalMode('view');
    setModalType(tx.type);
    setFormData(tx);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'view') return;
    if (modalMode === 'edit') {
      setTransactions(transactions.map(t => t.id === formData.id ? { ...t, ...formData } as Transaction : t));
    } else {
      setTransactions([{ id: Date.now().toString(), ...formData } as Transaction, ...transactions]);
    }
    setIsModalOpen(false);
  };

  const handleCategoryChange = (code: string) => {
    const cat = FINANCE_CATEGORIES.find(c => c.code === code);
    if (cat) {
      setFormData({ ...formData, category_code: cat.code, category_name: cat.name });
    }
  };

  const handleSubjectChange = (id: string) => {
    const list = formData.subject_type === 'Partner' ? MOCK_PARTNERS : MOCK_EMPLOYEES;
    const selected = list.find(item => item.id === id);
    if (selected) {
      setFormData({ ...formData, subject_id: selected.id, subject_name: selected.name });
    }
  };

  const isReadOnly = modalMode === 'view';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng thu thực tế" value={formatVND(totals.thu)} icon={<TrendingUp className="text-green-600"/>} color="bg-green-50" trend={12.5} />
        <StatCard title="Tổng chi thực tế" value={formatVND(totals.chi)} icon={<TrendingDown className="text-red-600"/>} color="bg-red-50" trend={-4.2} />
        <StatCard title="Lợi nhuận ròng (P&L)" value={formatVND(totals.net)} icon={<Wallet className="text-blue-600"/>} color="bg-blue-50" />
        <StatCard title="Phiếu chờ phê duyệt" value={totals.pending} icon={<Clock className="text-orange-600"/>} color="bg-orange-50" />
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full lg:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo mã GD, mã C01-C07, đối tượng..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <button 
              onClick={() => handleOpenCreate('Thu')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Lập Phiếu Thu</span>
            </button>
            <button 
              onClick={() => handleOpenCreate('Chi')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Lập Phiếu Chi</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-6 border-t border-gray-50">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <CalendarIcon size={12}/> Kỳ hạch toán
            </label>
            <div className="flex flex-col gap-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              >
                <option>Tháng này</option>
                <option>Quý này</option>
                <option>Tùy chọn</option>
              </select>
              {timeRange === 'Tùy chọn' && (
                <div className="flex items-center gap-2 animate-in slide-in-from-top-2">
                  <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 border-none rounded-lg text-[10px] font-bold" />
                  <span className="text-gray-300">-</span>
                  <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 border-none rounded-lg text-[10px] font-bold" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Building2 size={12}/> Đơn vị & Trạng thái
            </label>
            <div className="flex gap-2">
              <select value={filterBU} onChange={(e) => setFilterBU(e.target.value)} className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                <option>Tất cả BU</option>
                {BUS.map(bu => <option key={bu}>{bu}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                <option>Tất cả</option>
                <option>Đã thanh toán</option>
                <option>Chưa thanh toán</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Filter size={12}/> Lọc nhanh loại giao dịch
            </label>
            <div className="flex bg-gray-100 p-1.5 rounded-[20px] w-full max-w-sm">
              <button onClick={() => setTypeFilter('All')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${typeFilter === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Tất cả</button>
              <button onClick={() => setTypeFilter('Thu')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${typeFilter === 'Thu' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:text-green-600'}`}>Dòng Thu</button>
              <button onClick={() => setTypeFilter('Chi')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${typeFilter === 'Chi' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'text-gray-400 hover:text-red-600'}`}>Dòng Chi</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Nhật ký giao dịch (<span className="text-blue-600">{filteredTransactions.length}</span> phiếu hạch toán)
          </p>
          <div className="flex items-center gap-2">
             <CalendarDays size={14} className="text-gray-300" />
             <span className="text-[11px] font-bold text-gray-500 uppercase">{timeRange}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày hạch toán</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Số chứng từ</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại mã</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hạng mục nghiệp vụ</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đối tượng hạch toán</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Giá trị (VNĐ)</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">BU</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-blue-50/10 transition-all group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-gray-500 italic">
                      {new Date(tx.tx_date).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button onClick={() => handleOpenView(tx)} className="text-sm font-black text-blue-600 hover:underline">{tx.tx_code}</button>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-black bg-gray-50 px-2 py-1 rounded-lg text-gray-600 border border-gray-100">
                      {tx.category_code}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{tx.category_name}</span>
                      <span className={`text-[9px] font-black uppercase ${tx.type === 'Thu' ? 'text-green-500' : 'text-red-400'}`}>Dòng {tx.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {tx.subject_type === 'Partner' ? <Building2 size={14} className="text-gray-400"/> : <Users size={14} className="text-gray-400"/>}
                      <span className="text-sm font-semibold text-gray-600 line-clamp-1">{tx.subject_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`text-[15px] font-black ${tx.type === 'Thu' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'Thu' ? '+' : '-'}{formatVND(tx.amount)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      {tx.business_unit}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      tx.status === 'Paid' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {tx.status === 'Paid' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                      {tx.status === 'Paid' ? 'Hoàn tất' : 'Đang treo'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenView(tx)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Eye size={16}/></button>
                      <button onClick={() => handleOpenEdit(tx)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(tx.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <Search size={64} strokeWidth={1} className="mb-4 text-gray-400" />
                      <p className="font-black text-gray-500 uppercase tracking-[0.2em] text-sm italic">Không có dữ liệu chứng từ tương ứng</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-8 border-b border-gray-50 flex items-center justify-between ${modalType === 'Thu' ? 'bg-green-50/30' : 'bg-red-50/30'}`}>
              <div>
                <h3 className={`text-2xl font-black tracking-tight ${modalType === 'Thu' ? 'text-green-800' : 'text-red-800'}`}>
                  {modalMode === 'view' ? 'Hồ sơ hạch toán' : modalMode === 'edit' ? 'Cập nhật chứng từ' : `Khởi tạo Phiếu ${modalType}`}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Hệ thống BlueBolt Engine | Số: <span className="text-gray-900 font-black">{formData.tx_code}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày hạch toán</label>
                  <input disabled={isReadOnly} required type="date" value={formData.tx_date} onChange={(e) => setFormData({...formData, tx_date: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Danh mục hạch toán (C01-C07/T01-T03)</label>
                  <select disabled={isReadOnly} required value={formData.category_code} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer">
                    <option value="">-- Chọn danh mục --</option>
                    {FINANCE_CATEGORIES.filter(c => c.type === modalType).map(cat => (
                      <option key={cat.code} value={cat.code}>[{cat.code}] {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Số tiền hạch toán (VNĐ)</label>
                  <input disabled={isReadOnly} required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-lg font-black text-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Loại đối tượng</label>
                  <select disabled={isReadOnly} value={formData.subject_type} onChange={(e) => setFormData({...formData, subject_type: e.target.value as any, subject_id: '', subject_name: ''})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer">
                    <option value="Partner">Đối tác / Khách hàng</option>
                    <option value="Employee">Nhân viên hệ thống</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ tên / Pháp nhân đối tượng</label>
                  <select disabled={isReadOnly} required value={formData.subject_id} onChange={(e) => handleSubjectChange(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer">
                    <option value="">-- Chọn đối tượng liên quan --</option>
                    {(formData.subject_type === 'Partner' ? MOCK_PARTNERS : MOCK_EMPLOYEES).map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Phương thức thanh toán</label>
                  <select disabled={isReadOnly} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer" value={formData.payment_method} onChange={(e) => setFormData({...formData, payment_method: e.target.value})}>
                    <option>Chuyển khoản ngân hàng</option>
                    <option>Tiền mặt tại quỹ</option>
                    <option>Cấn trừ công nợ</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái phê duyệt</label>
                  <select disabled={isReadOnly} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                    <option value="Paid">Đã thanh toán (Hoàn tất)</option>
                    <option value="Unpaid">Chưa thanh toán (Treo phiếu)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Lý do / Nội dung chi tiết</label>
                <textarea disabled={isReadOnly} rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-100 resize-none italic" placeholder="Diễn giải nghiệp vụ phát sinh..."></textarea>
              </div>

              <div className="bg-blue-50/40 p-8 rounded-[32px] border border-blue-100 space-y-6">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2"><Briefcase size={14}/> Trung tâm chi phí & Phân bổ (P&L Unit)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select disabled={isReadOnly} value={formData.allocation_type} onChange={(e) => setFormData({...formData, allocation_type: e.target.value as any, business_unit: e.target.value === 'Direct' ? BUS[0] : 'Mixed'})} className="w-full px-5 py-4 bg-white border-none rounded-2xl outline-none text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer">
                    <option value="Direct">Hạch toán trực tiếp (100% BU)</option>
                    <option value="Indirect">Hạch toán phân bổ (Hệ số %)</option>
                  </select>
                  {formData.allocation_type === 'Direct' && (
                    <select disabled={isReadOnly} value={formData.business_unit} onChange={(e) => setFormData({...formData, business_unit: e.target.value})} className="w-full px-5 py-4 bg-white border-none rounded-2xl outline-none text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer">
                      {BUS.map(bu => <option key={bu} value={bu}>{bu}</option>)}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 px-6 border border-gray-100 rounded-[24px] text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors">Đóng cửa sổ</button>
                {!isReadOnly && (
                  <button type="submit" className={`flex-1 py-5 px-6 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${modalType === 'Thu' ? 'bg-green-600 shadow-green-100 hover:bg-green-700' : 'bg-red-600 shadow-red-100 hover:bg-red-700'}`}>Xác nhận hạch toán</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
