
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import BUManagement from './views/BUManagement';
import HRManagement from './views/HRManagement';
import FinanceManagement from './views/FinanceManagement';
import SystemAdmin from './views/SystemAdmin';
import SystemConfig from './views/SystemConfig';
import Reports from './views/Reports';
import Placeholder from './views/Placeholder';
import { NavItem, SubNavItem } from './types';
import { NAV_ITEMS } from './constants';

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<NavItem>(NAV_ITEMS[0]);
  const [activeSubItem, setActiveSubItem] = useState<SubNavItem | undefined>(undefined);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (item: NavItem, subItem?: SubNavItem) => {
    setActiveItem(item);
    setActiveSubItem(subItem);
  };

  const renderContent = () => {
    switch (activeItem.id) {
      case 'bu-management':
        return <BUManagement />;
      case 'hr-management':
        return <HRManagement />;
      case 'finance-management':
        return <FinanceManagement />;
      case 'reports':
        return <Reports />;
      case 'system-admin':
        return <SystemAdmin forcedTabId={activeSubItem?.id} />;
      case 'system-config':
        return <SystemConfig forcedTabId={activeSubItem?.id} />;
      default:
        return <Placeholder title={activeSubItem ? activeSubItem.label : activeItem.label} />;
    }
  };

  const getDisplayTitle = () => {
    if (activeSubItem) return activeSubItem.label;
    return activeItem.label;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-2xl font-black text-gray-900 tracking-tighter italic">
          BLUE<span className="text-blue-600">BOLT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      <Sidebar 
        activeId={activeItem.id} 
        activeSubId={activeSubItem?.id}
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <main className={`flex-1 transition-all duration-300 min-w-0 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header title={getDisplayTitle()} />
        
        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderContent()}
          </div>
        </div>

        <footer className="mt-20 py-10 px-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[13px] font-medium">
          <p>© 2024 BLUEBOLT Finance System. Kiến tạo bởi Senior Team.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600 transition-colors">Tài liệu API</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Trung tâm trợ giúp</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
