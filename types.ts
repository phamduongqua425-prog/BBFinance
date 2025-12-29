
import { ReactNode } from 'react';

export interface SubNavItem {
  id: string;
  label: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  subItems?: SubNavItem[];
}

export interface User {
  name: string;
  role: string;
  avatar: string;
}

export interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  icon: ReactNode;
  color: string;
}
