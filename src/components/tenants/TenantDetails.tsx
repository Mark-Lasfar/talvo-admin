import React from 'react';
import { Tenant } from '@/types';
import { X, Building2, Users, Key, Calendar, Clock, Mail, Phone, MapPin, CheckCircle, XCircle, Server, Wifi, WifiOff, Globe } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import toast from 'react-hot-toast';

interface TenantDetailsProps {
  tenant: Tenant;
  onClose: () => void;
  onUpdate: () => void;
}

export const TenantDetails: React.FC<TenantDetailsProps> = ({ tenant, onClose, onUpdate }) => {
  const { toggleStatus } = useTenants();

  const handleToggleStatus = async () => {
    const result = await toggleStatus(tenant.id);
    if (result.success) {
      onUpdate();
      onClose();
    }
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

  // ✅ ✅ ✅ دالة لحالة السيرفر
  const getServerStatus = () => {
    if (!tenant.is_primary_server) {
      return { label: 'غير مُعد', color: 'text-gray-400', icon: Server };
    }
    if (tenant.is_online) {
      return { label: '🟢 متصل', color: 'text-green-600', icon: Wifi };
    }
    return { label: '🔴 غير متصل', color: 'text-red-600', icon: WifiOff };
  };

  const status = getStatus();
  const StatusIcon = status.icon;
  const serverStatus = getServerStatus();
  const ServerIcon = serverStatus.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ✅ الهيدر */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-600" size={24} />
            <div>
              <h3 className="text-xl font-bold text-gray-800">{tenant.arabic_name || tenant.name}</h3>
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
            <span className={`font-medium ${status.color}`}>الحالة: {status.label}</span>
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
              <p className="text-sm font-mono text-gray-700 truncate">{tenant.license_key}</p>
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
                <p className="font-medium text-gray-700 capitalize">{tenant.subscription_plan}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">المستخدمين</p>
                <p className="font-medium text-gray-700">{tenant.total_users}/{tenant.max_users}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">تاريخ الإنشاء</p>
                <p className="font-medium text-gray-700">{formatDate(tenant.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">انتهاء الاشتراك</p>
                <p className="font-medium text-gray-700">
                  {tenant.subscription_expiry ? formatDate(tenant.subscription_expiry) : 'غير محدود'}
                </p>
              </div>
            </div>
          </div>

          {/* ✅ ✅ ✅ معلومات السيرفر (جديد) */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Server size={16} className="text-gray-400" />
              معلومات السيرفر
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
                <p className="font-medium text-gray-700">{tenant.primary_server_port || 5000}</p>
              </div>
              
              {tenant.primary_server_ip && (
                <div>
                  <p className="text-xs text-gray-400">IP</p>
                  <p className="font-mono text-sm text-gray-700" dir="ltr">{tenant.primary_server_ip}</p>
                </div>
              )}
              
              {tenant.primary_server_url && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">الرابط</p>
                  <p className="font-mono text-sm text-blue-600 truncate" dir="ltr">
                    {tenant.primary_server_url}
                  </p>
                </div>
              )}
              
              {tenant.last_heartbeat && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">آخر نبضة</p>
                  <p className="font-medium text-gray-700">{formatDate(tenant.last_heartbeat)}</p>
                </div>
              )}
            </div>
          </div>

          {/* ✅ الصلاحيات */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <CheckCircle size={16} className="text-gray-400" />
              الصلاحيات
            </h4>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div className={`flex items-center gap-1 ${tenant.can_manage_products ? 'text-green-600' : 'text-gray-400'}`}>
                {tenant.can_manage_products ? '✅' : '❌'} المنتجات
              </div>
              <div className={`flex items-center gap-1 ${tenant.can_manage_sales ? 'text-green-600' : 'text-gray-400'}`}>
                {tenant.can_manage_sales ? '✅' : '❌'} المبيعات
              </div>
              <div className={`flex items-center gap-1 ${tenant.can_manage_purchases ? 'text-green-600' : 'text-gray-400'}`}>
                {tenant.can_manage_purchases ? '✅' : '❌'} المشتريات
              </div>
              <div className={`flex items-center gap-1 ${tenant.can_manage_inventory ? 'text-green-600' : 'text-gray-400'}`}>
                {tenant.can_manage_inventory ? '✅' : '❌'} المخزون
              </div>
              <div className={`flex items-center gap-1 ${tenant.can_manage_customers ? 'text-green-600' : 'text-gray-400'}`}>
                {tenant.can_manage_customers ? '✅' : '❌'} العملاء
              </div>
              <div className={`flex items-center gap-1 ${tenant.can_manage_suppliers ? 'text-green-600' : 'text-gray-400'}`}>
                {tenant.can_manage_suppliers ? '✅' : '❌'} الموردين
              </div>
              <div className={`flex items-center gap-1 ${tenant.can_manage_employees ? 'text-green-600' : 'text-gray-400'}`}>
                {tenant.can_manage_employees ? '✅' : '❌'} الموظفين
              </div>
              <div className={`flex items-center gap-1 ${tenant.can_manage_reports ? 'text-green-600' : 'text-gray-400'}`}>
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
  );
};