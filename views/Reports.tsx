
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Wallet, 
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Legend
} from 'recharts';

// --- DANH MỤC CHI PHÍ ---
const EXPENSE_CATS = [
  { code: 'C01', name: 'Dịch vụ thuê ngoài', color: '#3b82f6' },
  { code: 'C02', name: 'Lương & Thưởng', color: '#10b981' },
  { code: 'C03', name: 'Chi phí Marketing', color: '#f59e0b' },
  { code: 'C04', name: 'Văn phòng phẩm', color: '#6366f1' },
  { code: 'C05', name: 'Điện nước, Internet', color: '#ec4899' },
  { code: 'C06', name: 'Công tác phí', color: '#8b5cf6' },
  { code: 'C07', name: 'Chi phí khác', color: '#94a3b8' },
];

const BUS = ['BlueBolt Software', 'BlueBolt Services', 'BlueBolt R&D', 'BlueBolt Academy', 'BlueBolt G&A'];

// --- DỮ LIỆU ĐỒNG BỘ TỪ QUẢN LÝ THU CHI ---
const SHARED_TRANSACTIONS = [
  { id: '1', tx_date: '2024-03-20', type: 'Thu', category_code: 'T01', business_unit: 'BlueBolt Software', amount: 155000000 },
  { id: '2', tx_date: '2024-03-19', type: 'Chi', category_code: 'C01', business_unit: 'BlueBolt G&A', amount: 12450000 },
  { id: '3', tx_date: '2024-03-18', type: 'Chi', category_code: 'C02', business_unit: 'BlueBolt Software', amount: 28000000 },
  { id: '4', tx_date: '2024-03-17', type: 'Chi', category_code: 'C03', business_unit: 'BlueBolt Services', amount: 42000000 },
  { id: '5', tx_date: '2024-03-15', type: 'Thu', category_code: 'T02', business_unit: 'BlueBolt G&A', amount: 12000000 },
  { id: '6', tx_date: '2024-03-12', type: 'Chi', category_code: 'C05', business_unit: 'BlueBolt G&A', amount: 8500000 },
  { id: '7', tx_date: '2024-03-10', type: 'Chi', category_code: 'C06', business_unit: 'BlueBolt R&D', amount: 5600000 },
  { id: '8', tx_date: '2024-02-28', type: 'Thu', category_code: 'T01', business_unit: 'BlueBolt Software', amount: 210000000 },
  { id: '9', tx_date: '2024-02-25', type: 'Chi', category_code: 'C02', business_unit: 'BlueBolt Services', amount: 35000000 },
  { id: '10', tx_date: '2024-02-20', type: 'Chi', category_code: 'C04', business_unit: 'BlueBolt Academy', amount: 2300000 },
  { id: '11', tx_date: '2024-02-15', type: 'Chi', category_code: 'C03', business_unit: 'BlueBolt Services', amount: 15000000 },
  { id: '12', tx_date: '2024-02-10', type: 'Thu', category_code: 'T03', business_unit: 'BlueBolt G&A', amount: 4500000 },
  { id: '13', tx_date: '2024-02-05', type: 'Chi', category_code: 'C07', business_unit: 'BlueBolt G&A', amount: 1200000 },
  { id: '14', tx_date: '2024-01-30', type: 'Thu', category_code: 'T01', business_unit: 'BlueBolt Software', amount: 180000000 },
  { id: '15', tx_date: '2024-01-25', type: 'Chi', category_code: 'C01', business_unit: 'BlueBolt R&D', amount: 55000000 },
  { id: '16', tx_date: '2024-01-20', type: 'Chi', category_code: 'C02', business_unit: 'BlueBolt Software', amount: 95000000 },
  { id: '17', tx_date: '2024-01-15', type: 'Chi', category_code: 'C05', business_unit: 'BlueBolt G&A', amount: 7200000 },
  { id: '18', tx_date: '2024-01-10', type: 'Chi', category_code: 'C06', business_unit: 'BlueBolt Services', amount: 3200000 },
  { id: '19', tx_date: '2024-01-05', type: 'Thu', category_code: 'T01', business_unit: 'BlueBolt Academy', amount: 45000000 },
  { id: '20', tx_date: '2024-01-02', type: 'Chi', category_code: 'C03', business_unit: 'BlueBolt Software', amount: 12000000 },
  { id: '21', tx_date: '2024-03-22', type: 'Chi', category_code: 'C07', business_unit: 'BlueBolt Software', amount: 1500000 },
];

const Reports: React.FC = () => {
  const [selectedBU, setSelectedBU] = useState('Tất cả BU');
  const [timeView, setTimeView] = useState('Tháng'); 
  const [selectedYear, setSelectedYear] = useState('2024');

  // 1. Tiền xử lý dữ liệu từ Transactions
  const processedData = useMemo(() => {
    return SHARED_TRANSACTIONS.map(t => {
      const date = new Date(t.tx_date);
      return {
        ...t,
        year: date.getFullYear().toString(),
        month: date.getMonth() + 1,
        quarter: Math.ceil((date.getMonth() + 1) / 3)
      };
    });
  }, []);

  // 2. Lọc theo Năm và BU
  const baseFiltered = useMemo(() => {
    return processedData.filter(d => 
      d.year === selectedYear && 
      (selectedBU === 'Tất cả BU' ? true : d.business_unit === selectedBU)
    );
  }, [processedData, selectedYear, selectedBU]);

  // 3. Tổng hợp hàng cho bảng
  const tableRows = useMemo(() => {
    if (selectedBU === 'Tất cả BU') {
      return BUS.map(buName => {
        const buItems = baseFiltered.filter(d => d.business_unit === buName);
        const row: any = { name: buName, thu: 0, chi: 0, profit: 0 };
        EXPENSE_CATS.forEach(c => row[c.code] = 0);
        buItems.forEach(item => {
          if (item.type === 'Thu') row.thu += item.amount;
          else {
            row.chi += item.amount;
            row[item.category_code] = (row[item.category_code] || 0) + item.amount;
          }
        });
        row.profit = row.thu - row.chi;
        return row;
      });
    } else {
      const length = timeView === 'Quý' ? 4 : 12;
      return Array.from({ length }, (_, i) => {
        const period = i + 1;
        const items = baseFiltered.filter(d => timeView === 'Quý' ? d.quarter === period : d.month === period);
        const row: any = { name: `${timeView} ${period}`, thu: 0, chi: 0, profit: 0 };
        EXPENSE_CATS.forEach(c => row[c.code] = 0);
        items.forEach(item => {
          if (item.type === 'Thu') row.thu += item.amount;
          else {
            row.chi += item.amount;
            row[item.category_code] = (row[item.category_code] || 0) + item.amount;
          }
        });
        row.profit = row.thu - row.chi;
        return row;
      });
    }
  }, [baseFiltered, selectedBU, timeView]);

  // 4. Dữ liệu cho biểu đồ tròn (Phân bổ chi phí)
  const expenseAllocationData = useMemo(() => {
    return EXPENSE_CATS.map(cat => {
      const total = baseFiltered
        .filter(d => d.type === 'Chi' && d.category_code === cat.code)
        .reduce((sum, d) => sum + d.amount, 0);
      return { name: cat.name, value: total, color: cat.color };
    }).filter(d => d.value > 0);
  }, [baseFiltered]);

  // 5. Dữ liệu hiệu suất BU (Nếu đang xem Tất cả BU)
  const buPerformanceData = useMemo(() => {
    return BUS.map(bu => {
      const items = processedData.filter(d => d.year === selectedYear && d.business_unit === bu);
      const thu = items.filter(d => d.type === 'Thu').reduce((s, d) => s + d.amount, 0);
      const chi = items.filter(d => d.type === 'Chi').reduce((s, d) => s + d.amount, 0);
      return { name: bu.replace('BlueBolt ', ''), thu, profit: thu - chi };
    });
  }, [processedData, selectedYear]);

  const grandTotals = useMemo(() => {
    const totals: any = { thu: 0, chi: 0, profit: 0 };
    EXPENSE_CATS.forEach(c => totals[c.code] = 0);
    tableRows.forEach((row: any) => {
      totals.thu += row.thu;
      totals.chi += row.chi;
      totals.profit += row.profit;
      EXPENSE_CATS.forEach(c => totals[c.code] += row[c.code]);
    });
    return totals;
  }, [tableRows]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* 1. KPI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingUp size={20}/></div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Doanh thu kỳ này</p>
            <h3 className="text-lg font-black text-gray-900">{formatCurrency(grandTotals.thu)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingDown size={20}/></div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Chi phí vận hành</p>
            <h3 className="text-lg font-black text-gray-900">{formatCurrency(grandTotals.chi)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Wallet size={20}/></div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lợi nhuận ròng</p>
            <h3 className="text-lg font-black text-gray-900">{formatCurrency(grandTotals.profit)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Activity size={20}/></div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Biên lợi nhuận</p>
            <h3 className="text-lg font-black text-gray-900">{grandTotals.thu > 0 ? ((grandTotals.profit / grandTotals.thu) * 100).toFixed(1) : 0}%</h3>
          </div>
        </div>
      </div>

      {/* 2. FILTER BAR */}
      <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bộ lọc Đơn vị (BU)</label>
          <div className="relative">
            <select 
              value={selectedBU}
              onChange={(e) => setSelectedBU(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option>Tất cả BU</option>
              {BUS.map(bu => <option key={bu} value={bu}>{bu}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phân nhóm thời gian</label>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['Tháng', 'Quý'].map(v => (
              <button 
                key={v}
                disabled={selectedBU === 'Tất cả BU'}
                onClick={() => setTimeView(v)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  timeView === v && selectedBU !== 'Tất cả BU' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 disabled:opacity-30'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Năm hạch toán</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
          >
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
      </div>

      {/* 3. TREND CHART */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase italic">Xu hướng dòng tiền P&L</h3>
            <p className="text-[11px] text-gray-400 font-medium italic mt-0.5">Số liệu thực tế đồng bộ từ Nhật ký giao dịch</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div><span className="text-[9px] font-black text-gray-400 uppercase">Thu</span></div>
             <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-[9px] font-black text-gray-400 uppercase">Chi</span></div>
             <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div><span className="text-[9px] font-black text-gray-400 uppercase">Lợi nhuận</span></div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={tableRows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} tickFormatter={(v) => `${v/1000000}M`} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }} formatter={(v: any) => formatCurrency(v)} />
              <Bar name="Thu" dataKey="thu" fill="#2563eb" radius={[3, 3, 0, 0]} barSize={24} />
              <Bar name="Chi" dataKey="chi" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={24} />
              <Line name="Lợi nhuận" type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 1.5, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. ANALYTICS CHARTS ROW (BEFORE TABLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phân bổ chi phí */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center gap-2 mb-6">
             <PieChartIcon size={18} className="text-blue-600" />
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Cơ cấu danh mục chi phí</h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={expenseAllocationData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {expenseAllocationData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip formatter={(v: any) => formatCurrency(v)} />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Hiệu suất sinh lời theo BU */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center gap-2 mb-6">
             <BarChart3 size={18} className="text-blue-600" />
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Hiệu suất lợi nhuận theo BU</h3>
          </div>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={buPerformanceData} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                 <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 9}} tickFormatter={(v) => `${v/1000000}M`} />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                 <Tooltip formatter={(v: any) => formatCurrency(v)} />
                 <Bar name="Doanh thu" dataKey="thu" fill="#bfdbfe" radius={[0, 4, 4, 0]} barSize={12} />
                 <Bar name="Lợi nhuận" dataKey="profit" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={12} />
                 <Legend verticalAlign="top" align="right" wrapperStyle={{fontSize: '10px'}} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. MAIN REPORT TABLE */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
          <div>
            <h3 className="text-base font-black text-gray-900 tracking-tight uppercase italic">Bảng kê hạch toán chi tiết</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5 italic">Dữ liệu hợp nhất từ Engine BLUEBOLT</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-5 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-gray-50 z-10 w-40">
                  {selectedBU === 'Tất cả BU' ? 'Business Unit' : 'Kỳ báo cáo'}
                </th>
                <th className="px-4 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Tổng thu</th>
                {EXPENSE_CATS.map(cat => (
                  <th key={cat.code} className="px-4 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right border-l border-gray-100/50">{cat.code}</th>
                ))}
                <th className="px-4 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right border-l-2 border-red-50">Tổng chi</th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableRows.map((row: any, idx) => (
                <tr key={idx} className="hover:bg-blue-50/10 transition-all group">
                  <td className="px-5 py-3.5 sticky left-0 bg-white group-hover:bg-blue-50/20 z-10 border-r border-gray-50">
                    <span className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{row.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-black text-green-600 text-[11px]">
                    {formatCurrency(row.thu)}
                  </td>
                  {EXPENSE_CATS.map(cat => (
                    <td key={cat.code} className="px-4 py-3.5 text-right font-bold text-gray-400 group-hover:text-gray-600 text-[11px] border-l border-gray-100/30">
                      {formatCurrency(row[cat.code] || 0)}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-right font-black text-red-500 text-[11px] bg-red-50/10 group-hover:bg-red-50/20 border-l-2 border-red-50">
                    {formatCurrency(row.chi)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className={`text-[12px] font-black ${row.profit >= 0 ? 'text-blue-600' : 'text-red-700'}`}>
                      {formatCurrency(row.profit)}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* FINAL SUMMARY FOOTER */}
              <tr className="bg-gray-900 text-white border-t-2 border-blue-600">
                <td className="px-5 py-6 sticky left-0 bg-gray-900 font-black text-[10px] uppercase tracking-widest italic border-r border-white/5">Tổng cộng hạch toán</td>
                <td className="px-4 py-6 text-right font-black text-green-400 text-xs">
                  {formatCurrency(grandTotals.thu)}
                </td>
                {EXPENSE_CATS.map(cat => (
                  <td key={cat.code} className="px-4 py-6 text-right font-bold text-gray-400 text-[10px] border-l border-white/5">
                    {formatCurrency(grandTotals[cat.code])}
                  </td>
                ))}
                <td className="px-4 py-6 text-right font-black text-red-400 text-xs border-l-2 border-white/10">
                  {formatCurrency(grandTotals.chi)}
                </td>
                <td className="px-6 py-6 text-right font-black text-blue-400 text-sm italic underline decoration-blue-600 underline-offset-4">
                  {formatCurrency(grandTotals.profit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 6. EXPORT BUTTONS */}
        <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95">
            <Download size={14} />
            <span>Kết xuất PDF (Report)</span>
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95">
            <FileSpreadsheet size={14} />
            <span>Sao lưu dữ liệu Excel</span>
          </button>
        </div>
      </div>

      {/* 7. LEGEND & FOOTNOTE */}
      <div className="flex flex-col md:flex-row gap-6 items-start opacity-70">
        <div className="flex-1 bg-gray-50 p-5 rounded-2xl border border-gray-100">
           <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
             <CalendarDays size={12}/> Nguyên tắc hạch toán
           </h4>
           <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-gray-500 leading-relaxed">• <b>Dữ liệu đồng bộ</b>: Báo cáo lấy trực tiếp từ các phiếu thu/chi đã được phê duyệt trong kỳ.</p>
              <p className="text-[10px] font-medium text-gray-500 leading-relaxed">• <b>Lợi nhuận ròng</b>: Giá trị thặng dư sau khi trừ đi tất cả các mã chi phí C01-C07.</p>
           </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-[2]">
           {EXPENSE_CATS.map(c => (
             <div key={c.code} className="flex flex-col">
                <span className="text-[9px] font-black text-blue-600 font-mono" style={{ color: c.color }}>{c.code}</span>
                <span className="text-[10px] font-bold text-gray-400">{c.name}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
