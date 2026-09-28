import React, { useState, useEffect } from 'react';
import { useTenants } from '@/hooks/useTenants';
import { TenantForm } from '@/components/tenants/TenantForm';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  RefreshCw,
  Server,
  Wifi,
  WifiOff,
  Network,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BranchesManager } from '@/components/branches/BranchesManager';  // ✅ جديد


export const Tenants: React.FC = () => {
  const { tenants, loading, loadTenants, deleteTenant, toggleStatus } = useTenants();
  const [showBranches, setShowBranches] = useState<any>(null);  // ✅ جديد
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTenants();
  }, []);

  // ✅ ✅ ✅ دالة لعرض حالة السيرفر
  const getServerStatusBadge = (tenant: any) => {
    if (!tenant.is_primary_server) {
      return { label: 'غير مُعد', color: 'bg-gray-100 text-gray-500' };
    }
    if (tenant.is_online) {
      return { label: '🟢 متصل', color: 'bg-green-100 text-green-600' };
    }
    return { label: '🔴 غير متصل', color: 'bg-red-100 text-red-600' };
  };

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.arabic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.license_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* ✅ الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏢 المستأجرين</h1>
          <p className="text-gray-500">
            إدارة الشركات والمؤسسات المسجلة في النظام
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTenant(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          إضافة مستأجر
        </button>
      </div>

      {/* ✅ شريط البحث */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="بحث عن مستأجر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* ✅ الجدول */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">#</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الاسم</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">المفتاح</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">المستخدمين</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الخطة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">السيرفر</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant, index) => {
                  const serverStatus = getServerStatusBadge(tenant);
                  return (
                    <tr key={tenant.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-800">{tenant.arabic_name || tenant.name}</div>
                          <div className="text-xs text-gray-400">{tenant.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded" dir="ltr">
                          {tenant.license_key.slice(0, 8)}...
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tenant.total_users}/{tenant.max_users}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-sm text-gray-600">
                          {tenant.subscription_plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tenant.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {tenant.is_active ? '✅ نشط' : '⛔ غير نشط'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${serverStatus.color}`}>
                            {serverStatus.label}
                          </span>
                          {tenant.is_primary_server && tenant.is_online && (
                            <span className="text-xs text-gray-400" dir="ltr">
                              {tenant.primary_server_ip}:{tenant.primary_server_port}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setShowBranches(tenant)}
                            className="p-1.5 hover:bg-purple-50 rounded text-purple-500 transition"
                            title="إدارة الفروع"
                          >
                            <Network size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingTenant(tenant);
                              setShowForm(true);
                            }}
                            className="p-1.5 hover:bg-blue-50 rounded text-blue-500 transition"
                            title="تعديل"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => toggleStatus(tenant.id)}
                            className={`p-1.5 rounded transition ${
                              tenant.is_active
                                ? 'hover:bg-yellow-50 text-yellow-500'
                                : 'hover:bg-green-50 text-green-500'
                            }`}
                            title={tenant.is_active ? 'تعطيل' : 'تفعيل'}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذا المستأجر؟')) {
                                deleteTenant(tenant.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 rounded text-red-500 transition"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredTenants.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto text-gray-300" size={48} />
              <p className="text-gray-500 mt-2">لا توجد مستأجرين</p>
            </div>
          )}
        </div>
      )}

      {/* ✅ نموذج الإضافة/التعديل */}
      {showForm && (
        <TenantForm
          tenant={editingTenant}
          onClose={() => {
            setShowForm(false);
            setEditingTenant(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingTenant(null);
            loadTenants();
          }}
        />
      )}
      
      {/* ✅ ✅ ✅ نافذة إدارة الفروع (جديد) */}
      {showBranches && (
        <BranchesManager
          tenant={showBranches}
          onClose={() => setShowBranches(null)}
        />
      )}
      
    </div>
  );
};