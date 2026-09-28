// src/components/branches/BranchesManager.tsx
import React, { useEffect, useState } from 'react';
import { Tenant, Branch } from '@/types';
import { useBranches } from '@/hooks/useBranches';
import { BranchForm } from './BranchForm';
import {
  X,
  Plus,
  Server,
  Copy,
  Trash2,
  Edit2,
  Power,
  Wifi,
  WifiOff,
  Key,
  RefreshCw,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { branchesApi } from '@/api/branches';

interface BranchesManagerProps {
  tenant: Tenant;
  onClose: () => void;
}

export const BranchesManager: React.FC<BranchesManagerProps> = ({
  tenant,
  onClose,
}) => {
  const {
    branches,
    loading,
    loadBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    toggleStatus,
  } = useBranches(tenant.id);

  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'inactive'>('all');


  useEffect(() => {
    loadBranches();
  }, [tenant.id]);

  // ✅ نسخ كود الفرع
  // ✅ نسخ كود الفرع
  const copyBranchCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('✅ تم نسخ كود الفرع');
  };

  // ✅ نسخ كل الأكواد
  const copyAllCodes = () => {
    const codes = filteredBranches.map((b) => `${b.branch_name}: ${b.branch_code}`).join('\n');
    navigator.clipboard.writeText(codes);
    toast.success('✅ تم نسخ كل الأكواد');
  };

  // ✅ Heartbeat يدوي
  const sendHeartbeat = async (branch: Branch) => {
    try {
      await branchesApi.heartbeat(branch.branch_code);
      toast.success('✅ تم إرسال النبضة');
      await loadBranches();
    } catch (error) {
      toast.error('فشل إرسال النبضة');
    }
  };

  // ✅ حذف فرع
  const handleDelete = async (branch: Branch) => {
    if (!confirm(`هل أنت متأكد من حذف "${branch.branch_name}"؟`)) return;
    await deleteBranch(branch.id);
  };

  // ✅ الفلترة
  const filteredBranches = branches.filter((b) => {
    const matchesSearch =
      b.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.arabic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.branch_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'online' && b.is_online && b.is_active) ||
      (filter === 'offline' && !b.is_online && b.is_active) ||
      (filter === 'inactive' && !b.is_active);

    return matchesSearch && matchesFilter;
  });

  // ✅ حالة الفرع
  const getStatusBadge = (branch: Branch) => {
    if (!branch.is_active) {
      return { label: '🔴 معطل', color: 'bg-gray-100 text-gray-500' };
    }
    if (branch.is_online) {
      return { label: '🟢 متصل', color: 'bg-green-100 text-green-600' };
    }
    return { label: '⚪ غير متصل', color: 'bg-yellow-100 text-yellow-600' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* ✅ الهيدر */}
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Server className="text-blue-600" size={22} />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                🌐 فروع {tenant.arabic_name || tenant.name}
              </h3>
              <p className="text-xs text-gray-500">
                {branches.length} فرع
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadBranches()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="تحديث"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ✅ شريط البحث + زر الإضافة */}
        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="بحث عن فرع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              <option value="all">الكل ({branches.length})</option>
              <option value="online">متصل ({branches.filter(b => b.is_online && b.is_active).length})</option>
              <option value="offline">غير متصل ({branches.filter(b => !b.is_online && b.is_active).length})</option>
              <option value="inactive">معطل ({branches.filter(b => !b.is_active).length})</option>
            </select>
            {branches.length > 0 && (
              <button
                onClick={copyAllCodes}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                title="نسخ كل الأكواد"
              >
                <Copy size={18} />
                نسخ الكل
              </button>
            )}
            <button
              onClick={() => {
                setEditingBranch(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <Plus size={18} />
              إضافة فرع
            </button>
          </div>

          {/* ✅ قائمة الفروع */}
          {loading && branches.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Server className="mx-auto text-gray-300" size={48} />
              <p className="text-gray-500 mt-2">
                {searchTerm ? 'لا توجد نتائج مطابقة' : 'لا توجد فروع'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  إضافة فرع جديد
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBranches.map((branch) => {
                const status = getStatusBadge(branch);
                return (
                  <div
                    key={branch.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                  >
                    {/* ✅ رأس البطاقة */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {branch.arabic_name || branch.branch_name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {branch.branch_name}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* ✅ كود الفرع */}
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">كود الفرع</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-gray-700 truncate flex-1" dir="ltr">
                          {branch.branch_code}
                        </code>
                        <button
                          onClick={() => copyBranchCode(branch.branch_code)}
                          className="p-1 hover:bg-gray-200 rounded transition"
                          title="نسخ الكود"
                        >
                          <Copy size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* ✅ معلومات */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="block text-gray-400">آخر ظهور</span>
                        <span className="font-medium">
                          {branch.last_seen
                            ? new Date(branch.last_seen).toLocaleString('ar-EG', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })
                            : 'لم يتصل بعد'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-400">المستخدمين</span>
                        <span className="font-medium">{branch.total_users}</span>
                      </div>
                    </div>

                    {/* ✅ الأزرار */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => sendHeartbeat(branch)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded transition"
                        title="إرسال نبضة"
                      >
                        <Activity size={14} />
                        نبضة
                      </button>
                      <button
                        onClick={() => {
                          setEditingBranch(branch);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit2 size={14} />
                        تعديل
                      </button>
                      <button
                        onClick={() => toggleStatus(branch.id)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition ${
                          branch.is_active
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        <Power size={14} />
                        {branch.is_active ? 'تعطيل' : 'تفعيل'}
                      </button>
                      <button
                        onClick={() => handleDelete(branch)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition mr-auto"
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ✅ نافذة إضافة/تعديل الفرع */}
      {showForm && (
        <BranchForm
          branch={editingBranch || undefined}
          onSubmit={async (data) => {
            if (editingBranch) {
              return await updateBranch(editingBranch.id, data);
            } else {
              return await createBranch(tenant.id, data);
            }
          }}
          onClose={() => {
            setShowForm(false);
            setEditingBranch(null);
          }}
        />
      )}
    </div>
  );
};