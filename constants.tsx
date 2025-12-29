
import React from 'react';
import { 
  Briefcase, 
  Users, 
  ArrowUpRight, 
  BarChart3, 
  ShieldCheck, 
  Settings 
} from 'lucide-react';
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'bu-management',
    label: 'Quản Lý BU',
    path: '/bu',
    icon: <Briefcase size={20} />
  },
  {
    id: 'hr-management',
    label: 'Quản lý nhân sự',
    path: '/hr',
    icon: <Users size={20} />
  },
  {
    id: 'finance-management',
    label: 'Quản lý thu chi',
    path: '/finance',
    icon: <ArrowUpRight size={20} />
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    path: '/reports',
    icon: <BarChart3 size={20} />
  },
  {
    id: 'system-admin',
    label: 'Quản trị hệ thống',
    path: '/admin',
    icon: <ShieldCheck size={20} />,
    subItems: [
      { id: 'user-management', label: 'Quản lý người dùng' },
      { id: 'role-permissions', label: 'Phân quyền & Vai trò' },
      { id: 'audit-logs', label: 'Nhật ký hệ thống' },
      { id: 'security-settings', label: 'Thiết lập bảo mật' }
    ]
  },
  {
    id: 'system-config',
    label: 'Cấu hình hệ thống',
    path: '/config',
    icon: <Settings size={20} />,
    subItems: [
      { id: 'finance-cat', label: 'Danh mục thu/chi' },
      { id: 'staff-levels', label: 'Cấp bậc nhân sự' },
      { id: 'specialties', label: 'Chuyên môn / Vai trò' },
      { id: 'allocation-rules', label: 'Quy tắc phân bổ' },
      { id: 'partner-management', label: 'Quản lý đối tác' }
    ]
  }
];

export const COLORS = {
  primary: '#2563eb', // blue-600
  secondary: '#1e293b', // slate-800
};
