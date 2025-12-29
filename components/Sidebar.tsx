
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { NavItem, SubNavItem } from '../types';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface SidebarProps {
  activeId: string;
  activeSubId?: string;
  onNavigate: (item: NavItem, subItem?: SubNavItem) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeId, activeSubId, onNavigate, isOpen, setIsOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['system-config']);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 transition-all duration-300 z-50 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between h-20 px-4 border-b border-gray-50 flex-shrink-0">
        <div className={`flex items-center space-x-2 transition-opacity duration-300 ${!isOpen && 'opacity-0 w-0 overflow-hidden'}`}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
            <span className="text-white font-black text-xl italic">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
            BLUE<span className="text-blue-600">BOLT</span>
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors flex-shrink-0"
        >
          <ChevronLeft size={18} className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedMenus.includes(item.id);

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => onNavigate(item)}
                className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                  isActive && !hasSubItems
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : isActive && hasSubItems
                    ? 'text-blue-600 bg-blue-50/50 font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`${(isActive && !hasSubItems) ? 'text-white' : isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>
                  {item.icon}
                </div>
                {isOpen && (
                  <>
                    <span className="ml-3 font-semibold text-[14px] whitespace-nowrap flex-1 text-left">
                      {item.label}
                    </span>
                    {hasSubItems && (
                      <div 
                        onClick={(e) => toggleExpand(item.id, e)}
                        className="p-1 hover:bg-black/5 rounded-md transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    )}
                  </>
                )}
              </button>

              {/* Sub Items */}
              {isOpen && hasSubItems && isExpanded && (
                <div className="ml-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {item.subItems?.map((sub) => {
                    const isSubActive = activeSubId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => onNavigate(item, sub)}
                        className={`w-full text-left px-4 py-2 text-[13px] rounded-xl transition-all ${
                          isSubActive 
                            ? 'text-blue-600 bg-blue-50 font-bold border-l-2 border-blue-600 rounded-l-none' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 flex-shrink-0">
        {isOpen && (
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mb-1">Phiên bản 2.5</p>
            <p className="text-xs text-blue-400">BLUEBOLT Finance Engine</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
