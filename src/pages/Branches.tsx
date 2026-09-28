// src/pages/Branches.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTenants } from '@/hooks/useTenants';
import { useBranches } from '@/hooks/useBranches';
import { Branch } from '@/types';
import { BranchesManager } from '@/components/branches/BranchesManager';
import {
  Network,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Users,
  Server,
  Wifi,
  WifiOff,
  Copy,
  Eye,
  ChevronDown,
  ChevronUp,
  Circle,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

export const Branches: React.FC = () => {
  const { tenants, loading: tenantsLoading, loadTenants } = useTenants();
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [showBranchesManager, setShowBranchesManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'inactive'>('all');
  const [expandedTenant, setExpandedTenant] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tenantParam = searchParams.get('tenant');
  useEffect(() => {
    loadTenants();
  }, []);

  // ✅ لو فيه tenant في URL، افتح الفروع تلقائياً
  useEffect(() => {
    if (tenantParam && tenants.length > 0) {
      const tenantId = parseInt(tenantParam);
      const tenant = tenants.find((t) => t.id === tenantId);
      
      if (tenant) {
        setSelectedTenant(tenantId);
        setShowBranchesManager(true);
        setExpandedTenant(tenantId); // ✅ توسيع المستأجر
      }
    }
  }, [tenantParam, tenants]);

  // ✅ الفلترة
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.arabic_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [tenants, searchTerm]);

  // ✅ الإحصائيات
  const stats = useMemo(() => {
    return {
      totalTenants: tenants.length,
      totalServers: tenants.filter((t) => t.is_primary_server).length,
      onlineServers: tenants.filter((t) => t.is_primary_server && t.is_online).length,
      offlineServers: tenants.filter((t) => t.is_primary_server && !t.is_online).length,
    };
  }, [tenants]);

  return (
    <div>
      {/* ✅ الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🌐 الفروع</h1>
          <p className="text-gray-500">
            إدارة فروع وأجهزة المستأجرين
          </p>
        </div>
        <button
          onClick={() => loadTenants()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          <RefreshCw size={18} className={tenantsLoading ? 'animate-spin' : ''} />
          تحديث
        </button>
      </div>

      {/* ✅ الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المستأجرين</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalTenants}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">السيرفرات الرئيسية</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalServers}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Server className="text-indigo-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">السيرفرات المتصلة</p>
              <p className="text-2xl font-bold text-green-600">{stats.onlineServers}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Wifi className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">السيرفرات غير المتصلة</p>
              <p className="text-2xl font-bold text-red-600">{stats.offlineServers}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <WifiOff className="text-red-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ البحث */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ابحث عن مستأجر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* ✅ قائمة المستأجرين */}
      {tenantsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Network className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-2">لا توجد مستأجرين</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTenants.map((tenant) => {
            const isExpanded = expandedTenant === tenant.id;

            return (
              <div
                key={tenant.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* ✅ الرأس */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() =>
                    setExpandedTenant(isExpanded ? null : tenant.id)
                  }
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {tenant.arabic_name || tenant.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {tenant.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* ✅ حالة السيرفر */}
                    {tenant.is_primary_server ? (
                      <div className="flex items-center gap-2">
                        {tenant.is_online ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <Circle size={8} fill="currentColor" />
                            متصل
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <Circle size={8} fill="currentColor" />
                            غير متصل
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        غير مُعد
                      </span>
                    )}

                    {/* ✅ زر إدارة الفروع */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTenant(tenant.id);
                        setShowBranchesManager(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition font-medium"
                    >
                      <Network size={14} />
                      إدارة
                    </button>

                    {/* ✅ زر التوسيع */}
                    <button className="p-1 hover:bg-gray-100 rounded transition">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* ✅ التفاصيل الموسعة */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* ✅ معلومات المستأجر */}
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <h4 className="text-xs font-medium text-gray-400 mb-2">
                          معلومات المستأجر
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">المفتاح:</span>
                            <code className="text-xs font-mono" dir="ltr">
                              {tenant.license_key.slice(0, 8)}...
                            </code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">الخطة:</span>
                            <span className="capitalize">{tenant.subscription_plan}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">المستخدمين:</span>
                            <span>
                              {tenant.total_users}/{tenant.max_users}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ✅ معلومات السيرفر */}
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <h4 className="text-xs font-medium text-gray-400 mb-2">
                          معلومات السيرفر
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">رئيسي:</span>
                            <span>{tenant.is_primary_server ? '✅ نعم' : '❌ لا'}</span>
                          </div>
                          {tenant.primary_server_ip && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">IP:</span>
                              <code className="text-xs font-mono" dir="ltr">
                                {tenant.primary_server_ip}
                              </code>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-500">المنفذ:</span>
                            <span>{tenant.primary_server_port}</span>
                          </div>
                        </div>
                      </div>

                      {/* ✅ الحالة */}
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <h4 className="text-xs font-medium text-gray-400 mb-2">
                          الحالة
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">نشط:</span>
                            <span>{tenant.is_active ? '✅' : '❌'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">آخر نبضة:</span>
                            <span className="text-xs">
                              {tenant.last_heartbeat
                                ? new Date(tenant.last_heartbeat).toLocaleString(
                                    'ar-EG',
                                    {
                                      dateStyle: 'short',
                                      timeStyle: 'short',
                                    }
                                  )
                                : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ✅ إحصائيات الفروع */}
                    <div className="mt-3 bg-white rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">
                            إدارة الفروع
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          اضغط "إدارة" لعرض الفروع
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ نافذة إدارة الفروع */}
      {/* ✅ نافذة إدارة الفروع */}
      {showBranchesManager && selectedTenant && (
        <BranchesManager
          tenant={tenants.find((t) => t.id === selectedTenant)!}
          onClose={() => {
            setShowBranchesManager(false);
            setSelectedTenant(null);
            // ✅ نظف URL من parameter
            setSearchParams({});
            loadTenants();
          }}
        />
      )}
    </div>
  );
};