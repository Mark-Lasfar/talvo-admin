// src/api/branches.ts
import { api } from './client';
import {
  Branch,
  BranchCreate,
  BranchUpdate,
  BranchValidateResponse,
  BranchHeartbeatData,
} from '@/types';

export const branchesApi = {
  // ✅ جلب فروع مستأجر
  getByTenant: (tenantId: number) =>
    api.get<{ success: boolean; branches: Branch[]; count: number }>(
      `/api/v1/tenants/${tenantId}/branches`
    ),

  // ✅ إنشاء فرع
  create: (tenantId: number, data: BranchCreate) =>
    api.post<{ success: boolean; branch: Branch; message: string }>(
      `/api/v1/tenants/${tenantId}/branches`,
      data
    ),

  // ✅ التحقق من كود فرع (بدون auth - للفرع)
  validate: (branchCode: string) =>
    api.get<BranchValidateResponse>(
      `/api/v1/branches/${branchCode}/validate`
    ),

  // ✅ Heartbeat من الفرع
  heartbeat: (branchCode: string, data?: BranchHeartbeatData) =>
    api.post<{ success: boolean; message: string }>(
      `/api/v1/branches/${branchCode}/heartbeat`,
      data || {}
    ),

  // ✅ جلب فرع بالمعرف
  getById: (id: number) =>
    api.get<{ success: boolean; branch: Branch }>(
      `/api/v1/branches/${id}`
    ),

  // ✅ تعديل فرع
  update: (id: number, data: BranchUpdate) =>
    api.put<{ success: boolean; branch: Branch; message: string }>(
      `/api/v1/branches/${id}`,
      data
    ),

  // ✅ حذف فرع
  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(
      `/api/v1/branches/${id}`
    ),

  // ✅ تفعيل/تعطيل فرع
  toggleStatus: (id: number) =>
    api.post<{ success: boolean; branch: Branch; message: string }>(
      `/api/v1/branches/${id}/toggle-status`
    ),
};