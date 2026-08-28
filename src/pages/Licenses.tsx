import React, { useState, useEffect } from 'react';
import { useTenants } from '@/hooks/useTenants';
import { LicenseGenerator } from '@/components/licenses/LicenseGenerator';
import { Key, Copy, Users, Calendar, Building2, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const Licenses: React.FC = () => {
  const { tenants, loading, loadTenants } = useTenants();
  const [showGenerator, setShowGenerator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'inactive'>('all');

  // ✅ تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    loadTenants();
  }, []);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.arabic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.license_key.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'active' && t.is_active) ||
                         (filter === 'inactive' && !t.is_active) ||
                         (filter === 'expired' && t.subscription_expiry && new Date(t.subscription_expiry) < new Date());
    
    return matchesSearch && matchesFilter;
  });

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('تم نسخ المفتاح');
  };

  const getStatusBadge = (tenant: any) => {
    if (!tenant.is_active) {
      return { label: 'غير نشط', color: 'bg-gray-100 text-gray-600' };
    }
    if (tenant.subscription_expiry && new Date(tenant.subscription_expiry) < new Date()) {
      return { label: 'منتهي', color: 'bg-red-100 text-red-600' };
    }
    return { label: 'نشط', color: 'bg-green-100 text-green-600' };
  };

  const getDaysLeft = (expiry: string | null) => {
    if (!expiry) return 'غير محدود';
    const days = Math.ceil((new Date(expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'منتهي';
    if (days === 0) return 'اليوم';
    return `${days} يوم`;
  };

  const handleRefresh = () => {
    loadTenants();
    toast.success('تم تحديث البيانات');
  };

  return (
    <div>
      {/* ✅ الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🔑 المفاتيح</h1>
          <p className="text-gray-500">
            إدارة مفاتيح التفعيل للشركات والمؤسسات
            <span className="text-blue-600 font-medium mr-2">
              ({tenants.length} مفتاح)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            title="تحديث"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Key size={18} />
            توليد مفتاح جديد
          </button>
        </div>
      </div>

      {/* ✅ شريط البحث والفلتر */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث عن مفتاح أو شركة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
        >
          <option value="all">الكل</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="expired">منتهي</option>
        </select>
      </div>

      {/* ✅ قائمة المفاتيح */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Key className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-2">
            {searchTerm || filter !== 'all' ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد مفاتيح'}
          </p>
          {!searchTerm && filter === 'all' && (
            <button
              onClick={() => setShowGenerator(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              توليد مفتاح جديد
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTenants.map((tenant) => {
            const status = getStatusBadge(tenant);
            return (
              <div
                key={tenant.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                {/* ✅ رأس البطاقة */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {tenant.arabic_name || tenant.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{tenant.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* ✅ المفتاح */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-gray-700 truncate flex-1" dir="ltr">
                      {tenant.license_key}
                    </code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyLicense(tenant.license_key);
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded transition"
                      title="نسخ المفتاح"
                    >
                      <Copy size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* ✅ معلومات إضافية */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users size={14} />
                    <span>{tenant.total_users}/{tenant.max_users} مستخدم</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Building2 size={14} />
                    <span className="capitalize">{tenant.subscription_plan}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span>{getDaysLeft(tenant.subscription_expiry)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={14} />
                    <span>{new Date(tenant.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
                {/* ✅ ✅ ✅ حالة السيرفر */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">حالة السيرفر:</span>
                    <div className="flex items-center gap-2">
                      {tenant.is_primary_server ? (
                        <>
                          {tenant.is_online ? (
                            <span className="flex items-center gap-1 text-sm text-green-600">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              متصل
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-red-600">
                              <span className="w-2 h-2 bg-red-500 rounded-full" />
                              غير متصل
                            </span>
                          )}
                          {tenant.primary_server_ip && (
                            <span className="text-xs text-gray-400" dir="ltr">
                              {tenant.primary_server_ip}:{tenant.primary_server_port}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">غير مُعد</span>
                      )}
                    </div>
                  </div>
                  {tenant.last_heartbeat && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">آخر نبضة:</span>
                      <span className="text-xs text-gray-400">
                        {new Date(tenant.last_heartbeat).toLocaleString('ar-EG')}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ✅ نافذة توليد مفتاح */}
      {showGenerator && (
        <LicenseGenerator
          onClose={() => setShowGenerator(false)}
          onSuccess={() => {
            setShowGenerator(false);
            loadTenants();
            toast.success('✅ تم التوليد وتحديث البيانات');
          }}
        />
      )}
    </div>
  );
};