// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Key, 
  Settings, 
  BarChart3,
  LogOut,
  Menu,
  X,
  Users,
  Shield,
  Database,
  Network
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'لوحة التحكم' },
  { path: '/tenants', icon: Building2, label: 'المستأجرين' },
  { path: '/branches', icon: Network, label: 'الفروع' },
  { path: '/licenses', icon: Key, label: 'المفاتيح' },
  { path: '/settings', icon: Settings, label: 'الإعدادات' },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ Overlay للشاشات الصغيرة */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ✅ الشريط الجانبي */}
      <div
        className={clsx(
          'fixed top-0 right-0 z-50 h-full bg-white shadow-xl transition-all duration-300',
          'flex flex-col',
          open ? 'w-64' : 'w-20',
          'lg:relative lg:translate-x-0'
        )}
        style={{ direction: 'rtl' }}
      >
        {/* ✅ الهيدر */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className={clsx('flex items-center gap-2', !open && 'justify-center w-full')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            {open && (
              <span className="text-xl font-bold text-gray-800">Talvo</span>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ✅ القائمة */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  'hover:bg-blue-50 hover:text-blue-600',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600',
                  !open && 'justify-center'
                )
              }
            >
              <item.icon size={20} />
              {open && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ✅ تسجيل الخروج */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full',
              'hover:bg-red-50 hover:text-red-600 text-gray-600',
              !open && 'justify-center'
            )}
          >
            <LogOut size={20} />
            {open && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </div>
    </>
  );
};