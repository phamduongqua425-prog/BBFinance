
import React from 'react';
import { 
  DollarSign, 
  Briefcase, 
  Users, 
  Activity 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const data = [
  { name: 'Th2', revenue: 4000, expenses: 2400 },
  { name: 'Th3', revenue: 3000, expenses: 1398 },
  { name: 'Th4', revenue: 2000, expenses: 9800 },
  { name: 'Th5', revenue: 2780, expenses: 3908 },
  { name: 'Th6', revenue: 1890, expenses: 4800 },
  { name: 'Th7', revenue: 2390, expenses: 3800 },
  { name: 'CN', revenue: 3490, expenses: 4300 },
];

const MetricCard = ({ title, value, icon, bgColor, iconColor }: any) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center space-x-4">
    <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center`}>
      {React.cloneElement(icon, { className: iconColor, size: 24 })}
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-xl font-bold text-gray-900 mt-0.5">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Đơn hàng hôm nay" 
          value="1,240" 
          icon={<DollarSign />} 
          bgColor="bg-blue-50" 
          iconColor="text-blue-600"
        />
        <MetricCard 
          title="Thợ hoạt động" 
          value="84" 
          icon={<Briefcase />} 
          bgColor="bg-green-50" 
          iconColor="text-green-600"
        />
        <MetricCard 
          title="Doanh thu tháng" 
          value="450.2M" 
          icon={<Activity />} 
          bgColor="bg-orange-50" 
          iconColor="text-orange-600"
        />
        <MetricCard 
          title="Hoàn thành" 
          value="92%" 
          icon={<Users />} 
          bgColor="bg-purple-50" 
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thống kê tăng trưởng</h3>
              <p className="text-sm text-gray-400">So sánh doanh thu và chi phí</p>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm">Tuần</button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-400">Tháng</button>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Hiệu suất BU</h3>
          <div className="space-y-6">
            {[
              { name: 'Marketing', val: 85, color: 'bg-blue-500' },
              { name: 'Operations', val: 62, color: 'bg-orange-500' },
              { name: 'Customer Service', val: 94, color: 'bg-green-500' },
              { name: 'Development', val: 78, color: 'bg-purple-500' },
            ].map((bu) => (
              <div key={bu.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">{bu.name}</span>
                  <span className="text-gray-400">{bu.val}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${bu.color}`} style={{ width: `${bu.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
