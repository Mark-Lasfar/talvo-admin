import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tenantsApi } from '@/api/tenants';
import { Tenant, TenantCreate, TenantUpdate } from '@/types';

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tenantsApi.getAll({ limit: 100 });

      // ✅ الـ API بيرجع Array مباشرة
      if (Array.isArray(response)) {
        setTenants(response);
        setTotal(response.length);
      } else {
        // ✅ fallback لو غير متوقع
        setTenants([]);
        setTotal(0);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل تحميل المستأجرين';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTenant = useCallback(async (data: TenantCreate) => {
    try {
      const response = await tenantsApi.create(data);
      toast.success('تم إنشاء المستأجر بنجاح');
      await loadTenants();
      return { success: true, data: response };
    } catch (error) {
      toast.error('فشل إنشاء المستأجر');
      return { success: false };
    }
  }, [loadTenants]);

  const updateTenant = useCallback(async (id: number, data: TenantUpdate) => {
    try {
      const response = await tenantsApi.update(id, data);
      toast.success('تم تحديث المستأجر بنجاح');
      await loadTenants();
      return { success: true, data: response };
    } catch (error) {
      toast.error('فشل تحديث المستأجر');
      return { success: false };
    }
  }, [loadTenants]);

  const deleteTenant = useCallback(async (id: number, force?: boolean) => {
    try {
      await tenantsApi.delete(id, force);
      toast.success('تم حذف المستأجر بنجاح');
      await loadTenants();
      return { success: true };
    } catch (error) {
      toast.error('فشل حذف المستأجر');
      return { success: false };
    }
  }, [loadTenants]);

  const toggleStatus = useCallback(async (id: number) => {
    try {
      const response = await tenantsApi.toggleStatus(id);
      toast.success(response.message);
      await loadTenants();
      return { success: true };
    } catch (error) {
      toast.error('فشل تغيير حالة المستأجر');
      return { success: false };
    }
  }, [loadTenants]);

  const regenerateLicense = useCallback(async (id: number) => {
    try {
      const response = await tenantsApi.regenerateLicense(id);
      toast.success('تم إعادة توليد المفتاح بنجاح');
      return { success: true, license_key: response.license_key };
    } catch (error) {
      toast.error('فشل إعادة توليد المفتاح');
      return { success: false };
    }
  }, []);

    // ✅ ✅ ✅ دالة جديدة: إرسال نبضة
  const sendHeartbeat = useCallback(async (id: number) => {
    try {
      const response = await tenantsApi.heartbeat(id, {
        is_online: true,
      });
      toast.success('✅ تم تحديث حالة السيرفر');
      return { success: true, data: response };
    } catch (error) {
      toast.error('فشل إرسال النبضة');
      return { success: false };
    }
  }, []);

  // ═══════════════════════════════════════════════════════
  // ✅ ✅ ✅ Nebula VPN
  // ═══════════════════════════════════════════════════════
  const registerNebula = useCallback(async (id: number, data: {
    nebula_lighthouse_ip: string;
    nebula_lighthouse_port: number;
    nebula_network: string;
    nebula_public_ip?: string;
  }) => {
    try {
      await tenantsApi.registerNebula(id, data);
      toast.success('✅ تم تسجيل Nebula بنجاح');
      await loadTenants();
      return { success: true };
    } catch (error) {
      toast.error('فشل تسجيل Nebula');
      return { success: false };
    }
  }, [loadTenants]);

  // ═══════════════════════════════════════════════════════
  // ✅ ✅ ✅ المتجر الإلكتروني
  // ═══════════════════════════════════════════════════════
  const toggleShop = useCallback(async (id: number, shop_enabled?: boolean) => {
    try {
      const response = await tenantsApi.toggleShop(id, shop_enabled);
      toast.success(response.message || '✅ تم تحديث حالة المتجر');
      await loadTenants();
      return { success: true, shop_enabled: response.shop_enabled };
    } catch (error) {
      toast.error('فشل تغيير حالة المتجر');
      return { success: false };
    }
  }, [loadTenants]);

  const saveShopUrl = useCallback(async (id: number, shop_url: string) => {
    try {
      await tenantsApi.saveShopUrl(id, shop_url);
      toast.success('✅ تم حفظ رابط المتجر');
      await loadTenants();
      return { success: true };
    } catch (error) {
      toast.error('فشل حفظ رابط المتجر');
      return { success: false };
    }
  }, [loadTenants]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return {
    tenants,
    loading,
    total,
    error,
    loadTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    toggleStatus,
    regenerateLicense,
    sendHeartbeat,
    registerNebula,
    toggleShop,
    saveShopUrl,
  };
};