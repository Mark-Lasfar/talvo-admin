import React, { useState } from 'react';
import { Tenant } from '@/types';
import { useTenants } from '@/hooks/useTenants';
import { Edit, Trash2, RefreshCw, Copy, CheckCircle, XCircle, Eye, Server, Wifi, WifiOff } from 'lucide-react';
import { TenantForm } from './TenantForm';
import { TenantDetails } from './TenantDetails';
import toast from 'react-hot-toast';

interface TenantCardProps {
  tenant: Tenant;
  onUpdate: () => void;
  onEdit?: () => void;
}

export const TenantCard: React.FC<TenantCardProps> = ({ tenant, onUpdate, onEdit }) => {
  const { deleteTenant, toggleStatus, regenerateLicense } = useTenants();
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleToggleStatus = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await toggleStatus(tenant.id);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف "${tenant.name}"؟`)) return;
    if (loading) return;
    setLoading(true);
    try {
      await deleteTenant(tenant.id);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateLicense = async () => {
    if (!confirm(`هل أنت متأكد من إعادة توليد مفتاح "${tenant.name}"؟`)) return;
    if (loading) return;
    setLoading(true);
    try {
      const result = await regenerateLicense(tenant.id);
      if (result.success && result.license_key) {
        toast.success(`المفتاح الجديد: ${result.license_key}`);
      }
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const copyLicense = () => {
    navigator.clipboard.writeText(tenant.license_key);
    toast.success('تم نسخ المفتاح');
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800',
  };

  const getStatus = () => {
    if (!tenant.is_active) return 'inactive';
    if (tenant.subscription_expiry && new Date(tenant.subscription_expiry) < new Date()) {
      return 'expired';
    }
    return 'active';
  };

  const status = getStatus();
  const statusLabels = {
    active: '✅ نشط',
    inactive: '❌ غير نشط',
    expired: '⏳ منتهي الاشتراك',
  };

  // ✅ ✅ ✅ دالة لحالة السيرفر
  const getServerStatus = () => {
    if (!tenant.is_primary_server) {
      return { label: 'غير مُعد', color: 'text-gray-400', icon: null };
    }
    if (tenant.is_online) {
      return { label: '🟢 متصل', color: 'text-green-600', icon: Wifi };
    }
    return { label: '🔴 غير متصل', color: 'text-red-600', icon: WifiOff };
  };

  const serverStatus = getServerStatus();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer" onClick={() => setShowDetails(true)}>
        {/* ✅ رأس البطاقة */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {tenant.arabic_name || tenant.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{tenant.name}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>

        {/* ✅ معلومات */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500">
            <span className="block text-xs">المستخدمين</span>
            <span className="font-medium text-gray-800">{tenant.total_users}/{tenant.max_users}</span>
          </div>
          <div className="text-gray-500">
            <span className="block text-xs">الخطة</span>
            <span className="font-medium text-gray-800 capitalize">{tenant.subscription_plan}</span>
          </div>
          <div className="col-span-2 text-gray-500">
            <span className="block text-xs">مفتاح التفعيل</span>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
                {tenant.license_key}
              </code>
              <button
                onClick={(e) => { e.stopPropagation(); copyLicense(); }}
                className="p-1 hover:bg-gray-100 rounded"
                title="نسخ المفتاح"
              >
                <Copy size={14} className="text-gray-400" />
              </button>
            </div>
          </div>
          {tenant.subscription_expiry && (
            <div className="col-span-2 text-gray-500">
              <span className="block text-xs">انتهاء الاشتراك</span>
              <span className="font-medium text-gray-800">
                {new Date(tenant.subscription_expiry).toLocaleDateString('ar-EG')}
              </span>
            </div>
          )}

          {/* ✅ ✅ ✅ حالة السيرفر (جديد) */}
          <div className="col-span-2 text-gray-500 border-t border-gray-100 pt-2 mt-1">
            <div className="flex items-center justify-between">
              <span className="block text-xs">حالة السيرفر</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${serverStatus.color}`}>
                  {serverStatus.label}
                </span>
                {tenant.is_primary_server && tenant.is_online && tenant.primary_server_ip && (
                  <span className="text-xs text-gray-400" dir="ltr">
                    {tenant.primary_server_ip}:{tenant.primary_server_port}
                  </span>
                )}
                {tenant.is_primary_server && tenant.last_heartbeat && (
                  <span className="text-xs text-gray-400">
                    {new Date(tenant.last_heartbeat).toLocaleTimeString('ar-EG')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ الأزرار */}
        <div className="mt-4 flex items-center gap-2 border-t pt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setShowEdit(true); if (onEdit) onEdit(); }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Edit size={16} />
            تعديل
          </button>
          <button
            onClick={handleRegenerateLicense}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
          >
            <RefreshCw size={16} />
            توليد مفتاح
          </button>
          <button
            onClick={handleToggleStatus}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition"
          >
            {tenant.is_active ? <XCircle size={16} /> : <CheckCircle size={16} />}
            {tenant.is_active ? 'تعطيل' : 'تفعيل'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition mr-auto"
          >
            <Trash2 size={16} />
            حذف
          </button>
          <button
            onClick={() => setShowDetails(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
          >
            <Eye size={16} />
            تفاصيل
          </button>
        </div>
      </div>

      {/* ✅ نافذة التفاصيل */}
      {showDetails && (
        <TenantDetails
          tenant={tenant}
          onClose={() => setShowDetails(false)}
          onUpdate={onUpdate}
        />
      )}

      {/* ✅ نافذة التعديل */}
      {showEdit && (
        <TenantForm
          tenant={tenant}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
};