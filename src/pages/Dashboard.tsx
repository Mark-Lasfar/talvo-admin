// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { StatsCards } from '@/components/stats/StatsCards';
import {
  Building2,
  Users,
  Key,
  DollarSign,
  Server,
  Network,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { statsApi } from '@/api/stats';
import { SystemStats } from '@/types';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsApi.getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('فشل تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStats();
    toast.success('✅ تم تحديث الإحصائيات');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* ✅ الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 لوحة التحكم</h1>
          <p className="text-gray-500">نظرة عامة على النظام</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition shadow-sm"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          تحديث
        </button>
      </div>

      {/* ✅ البطاقات الإحصائية الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* ✅ المستأجرين */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المستأجرين</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats?.total_tenants || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle size={12} />
              {stats?.active_tenants || 0} نشط
            </span>
            <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <AlertCircle size={12} />
              {stats?.inactive_tenants || 0} غير نشط
            </span>
          </div>
        </div>

        {/* ✅ المستخدمين */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats?.total_users || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            في جميع المستأجرين
          </div>
        </div>

        {/* ✅ السيرفرات */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">السيرفرات الرئيسية</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats?.total_servers || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Server className="text-indigo-600" size={24} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Wifi size={12} />
              {stats?.online_servers || 0} متصل
            </span>
            <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <WifiOff size={12} />
              {stats?.offline_servers || 0} غير متصل
            </span>
          </div>
        </div>

        {/* ✅ الفروع */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الفروع</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats?.total_branches || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
              <Network className="text-cyan-600" size={24} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Activity size={12} />
              {stats?.online_branches || 0} متصل
            </span>
            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
              <Clock size={12} />
              {(stats?.total_branches || 0) - (stats?.online_branches || 0)} غير متصل
            </span>
          </div>
        </div>
      </div>

      {/* ✅ إحصائيات ثانوية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* ✅ المبيعات */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-green-800 mt-1">
                ${(stats?.total_sales || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-700">
            <TrendingUp size={14} />
            إجمالي الإيرادات
          </div>
        </div>

        {/* ✅ الأرباح */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">إجمالي الأرباح</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                ${(stats?.total_profit || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-blue-700">
            <TrendingUp size={14} />
            صافي الربح
          </div>
        </div>

        {/* ✅ الفواتير */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">إجمالي الفواتير</p>
              <p className="text-2xl font-bold text-purple-800 mt-1">
                {(stats?.total_invoices || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="text-purple-600" size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-purple-700">
            <Activity size={14} />
            كل الفواتير
          </div>
        </div>

        {/* ✅ المفاتيح */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">المفاتيح النشطة</p>
              <p className="text-2xl font-bold text-yellow-800 mt-1">
                {stats?.active_tenants || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Key className="text-yellow-600" size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-yellow-700">
            <Key size={14} />
            من إجمالي {stats?.total_tenants || 0}
          </div>
        </div>
      </div>

      {/* ✅ توزيع الخطط + حالة النظام */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ✅ توزيع الخطط */}
        {stats && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                📋 توزيع الخطط
              </h3>
            </div>
            <div className="space-y-3">
              {/* ✅ Basic */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Basic</span>
                  <span className="text-sm text-gray-500">
                    {stats.plan_distribution.basic}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gray-400 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats.total_tenants > 0
                          ? (stats.plan_distribution.basic / stats.total_tenants) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* ✅ Pro */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Pro</span>
                  <span className="text-sm text-gray-500">
                    {stats.plan_distribution.pro}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats.total_tenants > 0
                          ? (stats.plan_distribution.pro / stats.total_tenants) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* ✅ Enterprise */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Enterprise
                  </span>
                  <span className="text-sm text-gray-500">
                    {stats.plan_distribution.enterprise}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats.total_tenants > 0
                          ? (stats.plan_distribution.enterprise /
                              stats.total_tenants) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ✅ إجمالي */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">إجمالي</span>
              <span className="text-lg font-bold text-gray-800">
                {stats.total_tenants}
              </span>
            </div>
          </div>
        )}

        {/* ✅ حالة النظام */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              🔍 حالة النظام
            </h3>
          </div>

          <div className="space-y-3">
            {/* ✅ حالة السيرفرات */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">السيرفرات</span>
              </div>
              <div className="flex items-center gap-2">
                {stats && stats.offline_servers > 0 ? (
                  <span className="text-sm text-red-600">
                    ⚠️ {stats.offline_servers} غير متصل
                  </span>
                ) : (
                  <span className="text-sm text-green-600">
                    ✅ كل السيرفرات متصلة
                  </span>
                )}
              </div>
            </div>

            {/* ✅ حالة الفروع */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Network size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">الفروع</span>
              </div>
              <div className="flex items-center gap-2">
                {stats && (stats.total_branches || 0) > (stats.online_branches || 0) ? (
                  <span className="text-sm text-yellow-600">
                    ⚠️ {(stats.total_branches || 0) - (stats.online_branches || 0)} غير متصل
                  </span>
                ) : (
                  <span className="text-sm text-green-600">
                    ✅ كل الفروع متصلة
                  </span>
                )}
              </div>
            </div>

            {/* ✅ حالة الاشتراكات */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Key size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">الاشتراكات</span>
              </div>
              <div className="flex items-center gap-2">
                {stats && stats.expired_tenants > 0 ? (
                  <span className="text-sm text-red-600">
                    ⚠️ {stats.expired_tenants} منتهي
                  </span>
                ) : (
                  <span className="text-sm text-green-600">
                    ✅ كل الاشتراكات سارية
                  </span>
                )}
              </div>
            </div>

            {/* ✅ حالة المستأجرين */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">المستأجرين</span>
              </div>
              <div className="flex items-center gap-2">
                {stats && stats.inactive_tenants > 0 ? (
                  <span className="text-sm text-yellow-600">
                    ⚠️ {stats.inactive_tenants} غير نشط
                  </span>
                ) : (
                  <span className="text-sm text-green-600">
                    ✅ كل المستأجرين نشطين
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};