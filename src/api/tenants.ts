import { api } from './client';
import { Tenant, TenantCreate, TenantUpdate } from '@/types';

export const tenantsApi = {
  // ✅ الـ API بيرجع Array مباشرة
  getAll: (params?: { skip?: number; limit?: number }) =>
    api.get<Tenant[]>('/api/v1/tenants', { params }),

  getById: (id: number) =>
    api.get<Tenant>(`/api/v1/tenants/${id}`),

  create: (data: TenantCreate) =>
    api.post<Tenant>('/api/v1/tenants', data),

  update: (id: number, data: TenantUpdate) =>
    api.put<Tenant>(`/api/v1/tenants/${id}`, data),

  delete: (id: number, force?: boolean) =>
    api.delete<{ success: boolean; message: string }>(
      `/api/v1/tenants/${id}${force ? '?force=true' : ''}`
    ),

  toggleStatus: (id: number) =>
    api.post<{ success: boolean; message: string }>(
      `/api/v1/tenants/${id}/toggle-status`
    ),

  regenerateLicense: (id: number) =>
    api.post<{ success: boolean; license_key: string }>(
      `/api/v1/licenses/${id}/regenerate`
    ),

  heartbeat: (id: number, data?: {
      is_online?: boolean;
      primary_server_url?: string;
      primary_server_ip?: string;
      primary_server_port?: number;
    }) =>
      api.post<{ success: boolean; message: string; tenant: Tenant }>(
        `/api/v1/tenants/${id}/heartbeat`,
        data || {}
      ),

};