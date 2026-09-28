import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tenant, Branch } from '@/types';
import { 
  X, 
  Building2, 
  Users, 
  Key, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Server, 
  Wifi, 
  WifiOff, 
  Network,
  Activity,
  RefreshCw,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import { branchesApi } from '@/api/branches';
import { BranchesManager } from '@/components/branches/BranchesManager';
import toast from 'react-hot-toast';

interface TenantDetailsProps {
  tenant: Tenant;
  onClose: () => void;
  onUpdate: () => void;
}

export const TenantDetails: React.FC<TenantDetailsProps> = ({ 
  tenant, 
  onClose, 
  onUpdate 
}) => {
  const navigate = useNavigate();  // ✅ جديد
  const { toggleStatus } = useTenants();
  const [showBranchesManager, setShowBranchesManager] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesCount, setBranchesCount] = useState(0);

  // ✅ تحميل الفروع
  useEffect(() => {
    loadBranches();
  }, [tenant.id]);

  const loadBranches = async () => {
    try {
      setBranchesLoading(true);
      const response = await branchesApi.getByTenant(tenant.id);
      if (response.success) {
        setBranches(response.branches || []);
        setBranchesCount(response.count || 0);
      }
    } catch (error) {
      setBranches([]);
      setBranchesCount(0);
    } finally {
      setBranchesLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const result = await toggleStatus(tenant.id);
    if (result.success) {
      onUpdate();
      onClose();
    }
  };

  // ✅ الانتقال لصفحة الفروع
  const goToBranchesPage = () => {
    onClose();  // ✅ إغلاق الـ Modal
    navigate(`/branches?tenant=${tenant.id}`);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatus = () => {
    if (!tenant.is_active) return { label: 'غير نشط', color: 'text-red-600', icon: XCircle };
    if (tenant.subscription_expiry && new Date(tenant.subscription_expiry) < new Date()) {
      return { label: 'منتهي الاشتراك', color: 'text-orange-600', icon: Clock };
    }
    return { label: 'نشط', color: 'text-green-600', icon: CheckCircle };
  };

  const getServerStatus = () => {
    if (!tenant.is_primary_server) {
      return { label: 'غير مُعد', color: 'text-gray-400', icon: Server };
    }
    if (tenant.is_online) {
      return { label: '🟢 متصل', color: 'text-green-600', icon: Wifi };
    }
    return { label: '🔴 غير متصل', color: 'text-red-600', icon: WifiOff };
  };

  const getBranchesStats = () => {
    const total = branches.length;
    const online = branches.filter((b) => b.is_online && b.is_active).length;
    const offline = branches.filter((b) => !b.is_online && b.is_active).length;
    const inactive = branches.filter((b) => !b.is_active).length;
    return { total, online, offline, inactive };
  };

  const status = getStatus();
  const StatusIcon = status.icon;
  const serverStatus = getServerStatus();
  const ServerIcon = serverStatus.icon;
  const branchStats = getBranchesStats();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* ✅ الهيدر */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <Building2 className="text-blue-600" size={24} />
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {tenant.arabic_name || tenant.name}
                </h3>
                <p className="text-sm text-gray-500">{tenant.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* ✅ المعلومات */}
          <div className="p-6 space-y-6">
            {/* ✅ الحالة */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <StatusIcon className={status.color} size={20} />
              <span className={`font-medium ${status.color}`}>
                الحالة: {status.label}
              </span>
              <button
                onClick={handleToggleStatus}
                className="mr-auto px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition"
              >
                تغيير الحالة
              </button>
            </div>

            {/* ✅ معلومات الشركة */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">المعرف</p>
                <p className="text-sm font-medium text-gray-700">#{tenant.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">مفتاح التفعيل</p>
                <p className="text-sm font-mono text-gray-700 truncate">
                  {tenant.license_key}
                </p>
              </div>
            </div>

            {/* ✅ جهات الاتصال */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                جهات الاتصال
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  {tenant.email || '-'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  {tenant.phone || '-'}
                </div>
                <div className="col-span-2 flex items-start gap-2 text-gray-600">
                  <MapPin size={14} className="text-gray-400 mt-0.5" />
                  {tenant.address || '-'}
                </div>
              </div>
            </div>

            {/* ✅ الاشتراك */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <Key size={16} className="text-gray-400" />
                الاشتراك
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-gray-400">الخطة</p>
                  <p className="font-medium text-gray-700 capitalize">
                    {tenant.subscription_plan}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">المستخدمين</p>
                  <p className="font-medium text-gray-700">
                    {tenant.total_users}/{tenant.max_users}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">تاريخ الإنشاء</p>
                  <p className="font-medium text-gray-700">
                    {formatDate(tenant.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">انتهاء الاشتراك</p>
                  <p className="font-medium text-gray-700">
                    {tenant.subscription_expiry
                      ? formatDate(tenant.subscription_expiry)
                      : 'غير محدود'}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ معلومات السيرفر */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <Server size={16} className="text-gray-400" />
                معلومات السيرفر الرئيسي
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <ServerIcon className={serverStatus.color} size={16} />
                    <span className={`font-medium ${serverStatus.color}`}>
                      الحالة: {serverStatus.label}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400">سيرفر رئيسي</p>
                  <p className="font-medium text-gray-700">
                    {tenant.is_primary_server ? '✅ نعم' : '❌ لا'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">المنفذ</p>
                  <p className="font-medium text-gray-700">
                    {tenant.primary_server_port || 5000}
                  </p>
                </div>

                {tenant.primary_server_ip && (
                  <div>
                    <p className="text-xs text-gray-400">IP</p>
                    <p className="font-mono text-sm text-gray-700" dir="ltr">
                      {tenant.primary_server_ip}
                    </p>
                  </div>
                )}

                {tenant.primary_server_url && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">الرابط</p>
                    <p
                      className="font-mono text-sm text-blue-600 truncate"
                      dir="ltr"
                    >
                      {tenant.primary_server_url}
                    </p>
                  </div>
                )}

                {tenant.last_heartbeat && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">آخر نبضة</p>
                    <p className="font-medium text-gray-700">
                      {formatDate(tenant.last_heartbeat)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ الفروع */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <Network size={16} className="text-gray-400" />
                  الفروع والأجهزة
                  {branchesCount > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                      {branchesCount}
                    </span>
                  )}
                </h4>
                <button
                  onClick={loadBranches}
                  disabled={branchesLoading}
                  className="p-1 hover:bg-gray-100 rounded transition"
                  title="تحديث"
                >
                  <RefreshCw
                    size={14}
                    className={`text-gray-400 ${branchesLoading ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                {/* ✅ إحصائيات سريعة */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {branchStats.total}
                    </p>
                    <p className="text-xs text-gray-500">إجمالي</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {branchStats.online}
                    </p>
                    <p className="text-xs text-gray-500">متصل</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {branchStats.offline}
                    </p>
                    <p className="text-xs text-gray-500">غير متصل</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">
                      {branchStats.inactive}
                    </p>
                    <p className="text-xs text-gray-500">معطل</p>
                  </div>
                </div>

                {/* ✅ قائمة مصغرة */}
                {branches.length > 0 && (
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {branches.slice(0, 3).map((branch) => (
                      <div
                        key={branch.id}
                        className="flex items-center justify-between bg-white p-2 rounded border border-purple-100 text-sm"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {branch.is_active && branch.is_online ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse" />
                          ) : branch.is_active ? (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                          )}
                          <span className="truncate font-medium text-gray-700">
                            {branch.arabic_name || branch.branch_name}
                          </span>
                        </div>
                        <code
                          className="text-xs font-mono text-gray-500 flex-shrink-0"
                          dir="ltr"
                        >
                          {branch.branch_code}
                        </code>
                      </div>
                    ))}
                    {branches.length > 3 && (
                      <p className="text-xs text-center text-gray-500">
                        و {branches.length - 3} فرع آخر...
                      </p>
                    )}
                  </div>
                )}

                {branches.length === 0 && !branchesLoading && (
                  <div className="text-center py-3">
                    <Network className="mx-auto text-purple-200" size={32} />
                    <p className="text-sm text-gray-500 mt-1">لا توجد فروع</p>
                  </div>
                )}

                {/* ✅ الأزرار */}
                <div className="grid grid-cols-2 gap-2">
                  {/* ✅ إدارة (Modal) */}
                  <button
                    onClick={() => setShowBranchesManager(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                  >
                    <Network size={16} />
                    {branches.length > 0 ? 'إدارة' : 'إضافة'}
                  </button>

                  {/* ✅ عرض الكل (صفحة مستقلة) */}
                  <button
                    onClick={goToBranchesPage}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-purple-50 text-purple-600 border border-purple-200 font-medium rounded-lg transition"
                    title="عرض كل الفروع في صفحة مستقلة"
                  >
                    <Eye size={16} />
                    عرض الكل
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ الصلاحيات */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <CheckCircle size={16} className="text-gray-400" />
                الصلاحيات
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_products ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_products ? '✅' : '❌'} المنتجات
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_sales ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_sales ? '✅' : '❌'} المبيعات
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_purchases ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_purchases ? '✅' : '❌'} المشتريات
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_inventory ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_inventory ? '✅' : '❌'} المخزون
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_customers ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_customers ? '✅' : '❌'} العملاء
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_suppliers ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_suppliers ? '✅' : '❌'} الموردين
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_employees ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_employees ? '✅' : '❌'} الموظفين
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    tenant.can_manage_reports ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {tenant.can_manage_reports ? '✅' : '❌'} التقارير
                </div>
              </div>
            </div>
          </div>

          {/* ✅ الأزرار */}
          <div className="flex items-center gap-3 p-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      {/* ✅ نافذة إدارة الفروع */}
      {showBranchesManager && (
        <BranchesManager
          tenant={tenant}
          onClose={() => {
            setShowBranchesManager(false);
            loadBranches();
          }}
        />
      )}
    </>
  );
};