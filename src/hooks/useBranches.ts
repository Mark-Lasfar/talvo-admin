// src/hooks/useBranches.ts
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { branchesApi } from '@/api/branches';
import { Branch, BranchCreate, BranchUpdate } from '@/types';

export const useBranches = (tenantId?: number) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // ✅ جلب الفروع
  const loadBranches = useCallback(async (id?: number) => {
    const tid = id || tenantId;
    if (!tid) return;

    try {
      setLoading(true);
      const response = await branchesApi.getByTenant(tid);
      
      if (response.success) {
        setBranches(response.branches || []);
        setTotal(response.count || 0);
      }
    } catch (error) {
      console.error('Load branches error:', error);
      toast.error('فشل تحميل الفروع');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  // ✅ إنشاء فرع
  const createBranch = useCallback(async (id: number, data: BranchCreate) => {
    try {
      const response = await branchesApi.create(id, data);
      
      if (response.success) {
        toast.success(response.message || '✅ تم إنشاء الفرع بنجاح');
        await loadBranches(id);
        return { success: true, branch: response.branch };
      }
      return { success: false };
    } catch (error) {
      toast.error('فشل إنشاء الفرع');
      return { success: false };
    }
  }, [loadBranches]);

  // ✅ تعديل فرع
  const updateBranch = useCallback(async (id: number, data: BranchUpdate) => {
    try {
      const response = await branchesApi.update(id, data);
      
      if (response.success) {
        toast.success(response.message || '✅ تم تحديث الفرع');
        await loadBranches();
        return { success: true, branch: response.branch };
      }
      return { success: false };
    } catch (error) {
      toast.error('فشل تحديث الفرع');
      return { success: false };
    }
  }, [loadBranches]);

  // ✅ حذف فرع
  const deleteBranch = useCallback(async (id: number) => {
    try {
      const response = await branchesApi.delete(id);
      
      if (response.success) {
        toast.success(response.message || '✅ تم حذف الفرع');
        await loadBranches();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error('فشل حذف الفرع');
      return { success: false };
    }
  }, [loadBranches]);

  // ✅ تفعيل/تعطيل
  const toggleStatus = useCallback(async (id: number) => {
    try {
      const response = await branchesApi.toggleStatus(id);
      
      if (response.success) {
        toast.success(response.message || '✅ تم التحديث');
        await loadBranches();
        return { success: true, branch: response.branch };
      }
      return { success: false };
    } catch (error) {
      toast.error('فشل تغيير الحالة');
      return { success: false };
    }
  }, [loadBranches]);

  return {
    branches,
    loading,
    total,
    loadBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    toggleStatus,
  };
};