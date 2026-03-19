import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Truck,
  Users,
  ShoppingCart,
  ShoppingBag,
  Building2,
  UserCheck,
  CalendarCheck,
  FileText,
  Settings,
  Warehouse,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  ariaLabel?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const mainNavItem: NavItem = {
  title: 'لوحة التحكم',
  href: '/',
  icon: LayoutDashboard,
  ariaLabel: 'الانتقال إلى لوحة التحكم',
};

export const navGroups: NavGroup[] = [
  {
    label: 'إدارة المخزون',
    items: [
      { title: 'المخزون', href: '/inventory', icon: Package },
      { title: 'الأصناف', href: '/items', icon: ClipboardList },
      { title: 'المناقلات', href: '/transfers', icon: ArrowLeftRight },
      { title: 'الجرد والتسوية', href: '/audit', icon: FileText },
    ],
  },
  {
    label: 'العمليات التجارية',
    items: [
      { title: 'المشتريات', href: '/purchases', icon: ShoppingCart },
      { title: 'المبيعات', href: '/sales', icon: ShoppingBag },
      { title: 'الموردون', href: '/suppliers', icon: Building2 },
      { title: 'العملاء', href: '/customers', icon: Users },
    ],
  },
  {
    label: 'العمليات والموارد',
    items: [
      { title: 'الأسطول', href: '/fleet', icon: Truck },
      { title: 'الموظفون', href: '/employees', icon: UserCheck },
      { title: 'الحضور والانصراف', href: '/attendance', icon: CalendarCheck },
      { title: 'المستودعات', href: '/warehouses', icon: Warehouse },
    ],
  },
];

export const footerNavItems: NavItem[] = [
  { title: 'الإعدادات', href: '/settings', icon: Settings },
];
