// src/components/layout/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Search,
  Home,
  Building2,
  Network,
  Key,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

interface HeaderProps {
  toggleSidebar: () => void;
}

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ✅ إشعارات تجريبية (هنجيبها من API بعدين)
const demoNotifications: Notification[] = [
  {
    id: 1,
    type: 'warning',
    title: 'سيرفر غير متصل',
    message: 'السيرفر الرئيسي لشركة ABC غير متصل',
    time: 'منذ 5 دقائق',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'مستأجر جديد',
    message: 'تم إضافة مستأجر جديد: شركة XYZ',
    time: 'منذ ساعة',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    title: 'تم التجديد',
    message: 'تم تجديد اشتراك شركة DEF',
    time: 'منذ 3 ساعات',
    read: true,
  },
];

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [currentTime, setCurrentTime] = useState(new Date());

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ✅ الوقت الحالي (بيتحدث كل دقيقة)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ إغلاق الـ Search بالـ Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
      // Ctrl+K للبحث
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ✅ عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ إجراءات الإشعارات
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // ✅ تسجيل الخروج مع تأكيد
  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      logout();
    }
  };

  // ✅ البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // ✅ التوجيه حسب الكلمة
      navigate(`/tenants?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // ✅ أيقونة الإشعار حسب النوع
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={18} />;
      case 'error':
        return <X className="text-red-500" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <>
      <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* ✅ الجانب الأيمن */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition"
            title="القائمة"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 hidden sm:block">
            لوحة تحكم النظام
          </h1>
        </div>

        {/* ✅ الوسط: البحث */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={() => {
              setShowSearch(true);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 transition text-sm"
          >
            <Search size={16} />
            <span className="flex-1 text-right">بحث...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* ✅ الجانب الأيسر */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ✅ الوقت */}
          <div className="hidden lg:block text-right mr-2">
            <p className="text-xs text-gray-500">
              {currentTime.toLocaleDateString('ar-EG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <p className="text-sm font-medium text-gray-700">
              {currentTime.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* ✅ زر البحث (للموبايل) */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            title="بحث"
          >
            <Search size={20} />
          </button>

          {/* ✅ الإشعارات */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 relative transition"
              title="الإشعارات"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* ✅ قائمة الإشعارات */}
            {showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {/* ✅ الهيدر */}
                <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    الإشعارات
                    {unreadCount > 0 && (
                      <span className="mr-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {unreadCount} جديد
                      </span>
                    )}
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      تعليم الكل كمقروء
                    </button>
                  )}
                </div>

                {/* ✅ القائمة */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="mx-auto text-gray-300" size={40} />
                      <p className="text-gray-500 mt-2 text-sm">لا توجد إشعارات</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={clsx(
                          'p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition',
                          !notif.read && 'bg-blue-50/30'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={clsx(
                                  'text-sm font-medium text-gray-800',
                                  !notif.read && 'font-bold'
                                )}
                              >
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ✅ Footer */}
                {notifications.length > 0 && (
                  <div className="p-2 border-t bg-gray-50 flex items-center justify-between">
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      🗑️ حذف الكل
                    </button>
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        // navigate('/notifications');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                    >
                      عرض الكل →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ✅ قائمة المستخدم */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition"
              title="حسابي"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                {user?.full_name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {user?.full_name || 'مستخدم'}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  مدير النظام
                </p>
              </div>
              <ChevronDown
                size={16}
                className={clsx(
                  'text-gray-400 transition hidden sm:block',
                  showUserMenu && 'rotate-180'
                )}
              />
            </button>

            {/* ✅ القائمة المنسدلة */}
            {showUserMenu && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {/* ✅ معلومات المستخدم */}
                <div className="p-4 border-b bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user?.full_name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {user?.full_name || 'مستخدم'}
                      </p>
                      <p className="text-xs text-gray-600 truncate" dir="ltr">
                        {user?.email || 'admin@talvo.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ✅ الروابط */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User size={18} className="text-gray-400" />
                    <span>الملف الشخصي</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings size={18} className="text-gray-400" />
                    <span>الإعدادات</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/dashboard');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Home size={18} className="text-gray-400" />
                    <span>الصفحة الرئيسية</span>
                  </button>
                </div>

                {/* ✅ تسجيل الخروج */}
                <div className="border-t py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    <LogOut size={18} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ✅ زر تسجيل الخروج السريع (للموبايل) */}
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
            title="تسجيل الخروج"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* ✅ نافذة البحث */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b">
              <Search className="text-gray-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث عن مستأجر، فرع، مفتاح..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-lg bg-transparent"
              />
              <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded">
                ESC
              </kbd>
            </form>

            <div className="p-4">
              <p className="text-xs text-gray-400 mb-2">اختصارات سريعة</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowSearch(false);
                    navigate('/tenants');
                  }}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg text-right transition"
                >
                  <Building2 size={16} className="text-blue-600" />
                  <span className="text-sm">المستأجرين</span>
                </button>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    navigate('/branches');
                  }}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg text-right transition"
                >
                  <Network size={16} className="text-purple-600" />
                  <span className="text-sm">الفروع</span>
                </button>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    navigate('/licenses');
                  }}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg text-right transition"
                >
                  <Key size={16} className="text-yellow-600" />
                  <span className="text-sm">المفاتيح</span>
                </button>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    navigate('/settings');
                  }}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg text-right transition"
                >
                  <Settings size={16} className="text-gray-600" />
                  <span className="text-sm">الإعدادات</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};