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
      
  // ═══════════════════════════════════════════════════════
  // ✅ ✅ ✅ Nebula VPN
  // ═══════════════════════════════════════════════════════
  registerNebula: (id: number, data: {
    nebula_lighthouse_ip: string;
    nebula_lighthouse_port: number;
    nebula_network: string;
    nebula_public_ip?: string;
  }) =>
    api.post<{ success: boolean; tenant: Tenant }>(
      `/api/v1/tenants/${id}/register-nebula`,
      data
    ),

  nebulaHeartbeat: (id: number, data: { nebula_public_ip?: string }) =>
    api.post<{ 
      success: boolean; 
      nebula_public_ip: string;
      nebula_last_sync: string;
    }>(
      `/api/v1/tenants/${id}/nebula-heartbeat`,
      data
    ),

  // ═══════════════════════════════════════════════════════
  // ✅ ✅ ✅ المتجر الإلكتروني
  // ═══════════════════════════════════════════════════════
  toggleShop: (id: number, shop_enabled?: boolean) =>
    api.post<{ 
      success: boolean; 
      message: string; 
      shop_enabled: boolean;
      tenant: Tenant;
    }>(
      `/api/v1/tenants/${id}/toggle-shop`,
      { shop_enabled }
    ),

  saveShopUrl: (id: number, shop_url: string) =>
    api.post<{ 
      success: boolean; 
      message: string; 
      shop_url: string;
    }>(
      `/api/v1/tenants/${id}/save-shop-url`,
      { shop_url }
    ),

  // ✅ معلومات المتجر (بدون auth - للموقع)
  getShopInfo: (id: number) =>
    api.get<{
      success: boolean;
      shop: {
        tenant_id: number;
        tenant_name: string;
        tenant_arabic_name: string;
        shop_url: string;
        shop_enabled: boolean;
        currency: string;
        timezone: string;
        logo_path: string | null;
      };
    }>(`/api/v1/tenants/${id}/shop-info`),

};