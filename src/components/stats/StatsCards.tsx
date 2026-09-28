// src/components/stats/StatsCards.tsx
import React from 'react';
import { SystemStats } from '@/types';
import { Building2, Users, Key, DollarSign, Server, TrendingUp, TrendingDown, Network } from 'lucide-react';

interface StatsCardsProps {
  stats: SystemStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'إجمالي المستأجرين',
      value: stats.total_tenants,
      sub: `✅ ${stats.active_tenants} نشط | ❌ ${stats.inactive_tenants} غير نشط`,
      icon: Building2,
      color: 'blue',
    },
    {
      label: 'إجمالي المستخدمين',
      value: stats.total_users,
      sub: `في جميع المستأجرين`,
      icon: Users,
      color: 'purple',
    },
    {
      label: 'المفاتيح النشطة',
      value: stats.active_tenants,
      sub: `من إجمالي ${stats.total_tenants}`,
      icon: Key,
      color: 'yellow',
    },
    {
      label: 'إجمالي المبيعات',
      value: `$${stats.total_sales?.toLocaleString() || 0}`,
      sub: `💰 ربح: $${stats.total_profit?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'green',
    },
    // ✅ ✅ ✅ بطاقة السيرفر
    {
      label: 'السيرفرات',
      value: stats.total_servers || 0,
      sub: `🟢 ${stats.online_servers || 0} متصل | 🔴 ${stats.offline_servers || 0} غير متصل`,
      icon: Server,
      color: 'indigo',
    },
    // ✅ ✅ ✅ بطاقة الفروع (جديدة)
    {
      label: 'الفروع',
      value: stats.total_branches || 0,
      sub: `🟢 ${stats.online_branches || 0} متصل | ⚪ ${(stats.total_branches || 0) - (stats.online_branches || 0)} غير متصل`,
      icon: Network,  // ⚠️ محتاج تستورد Network
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[card.color as keyof typeof colorClasses]}`}>
              <card.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};