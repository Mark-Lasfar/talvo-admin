// =============================================
// ✅ أنواع المستأجرين (Tenants)
// =============================================

export interface Tenant {
  id: number;
  name: string;
  arabic_name?: string;
  license_key: string;
  db_name: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_number?: string | null;
  commercial_register?: string | null;
  currency: string;
  timezone: string;
  logo_path?: string | null;
  is_active: boolean;
  max_users: number;
  max_storage_mb: number;
  subscription_plan: 'basic' | 'pro' | 'enterprise';
  subscription_expiry: string | null;
  is_primary_server: boolean;
  primary_server_url: string | null;
  primary_server_ip: string | null;
  primary_server_port: number;
  is_online: boolean;
  last_heartbeat: string | null;
  can_manage_products: boolean;
  can_manage_sales: boolean;
  can_manage_purchases: boolean;
  can_manage_inventory: boolean;
  can_manage_customers: boolean;
  can_manage_suppliers: boolean;
  can_manage_employees: boolean;
  can_manage_reports: boolean;
  can_manage_settings: boolean;
  can_manage_backup: boolean;
  can_export_data: boolean;
  can_import_data: boolean;
  can_manage_roles: boolean;
  can_view_audit_log: boolean;
  total_users: number;
  total_storage_used_mb: number;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_deleted?: boolean;  

}

export interface TenantCreate {
  name: string;
  arabic_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  subscription_plan: 'basic' | 'pro' | 'enterprise';
  max_users: number;
  subscription_days: number;
  is_active?: boolean;
  is_primary_server?: boolean;
  primary_server_url?: string | null;
  primary_server_ip?: string | null;
  primary_server_port?: number;
  is_online?: boolean;

  can_manage_products?: boolean;
  can_manage_sales?: boolean;
  can_manage_purchases?: boolean;
  can_manage_inventory?: boolean;
  can_manage_customers?: boolean;
  can_manage_suppliers?: boolean;
  can_manage_employees?: boolean;
  can_manage_reports?: boolean;
  can_manage_settings?: boolean;
  can_manage_backup?: boolean;
  can_export_data?: boolean;
  can_import_data?: boolean;
  can_manage_roles?: boolean;
  can_view_audit_log?: boolean;
}

export interface TenantUpdate {
  name?: string;
  arabic_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  subscription_plan?: 'basic' | 'pro' | 'enterprise';
  max_users?: number;
  subscription_days?: number;
  is_active?: boolean;
  is_primary_server?: boolean;
  primary_server_url?: string | null;
  primary_server_ip?: string | null;
  primary_server_port?: number;
  is_online?: boolean;
  last_heartbeat?: string | null;
  can_manage_products?: boolean;
  can_manage_sales?: boolean;
  can_manage_purchases?: boolean;
  can_manage_inventory?: boolean;
  can_manage_customers?: boolean;
  can_manage_suppliers?: boolean;
  can_manage_employees?: boolean;
  can_manage_reports?: boolean;
  can_manage_settings?: boolean;
  can_manage_backup?: boolean;
  can_export_data?: boolean;
  can_import_data?: boolean;
  can_manage_roles?: boolean;
  can_view_audit_log?: boolean;
}

// =============================================
// ✅ أنواع مفاتيح التفعيل (Licenses)
// =============================================

export interface LicenseGenerate {
  name: string;
  arabic_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  subscription_plan: 'basic' | 'pro' | 'enterprise';
  max_users: number;
  subscription_days: number;
  can_manage_products?: boolean;
  can_manage_sales?: boolean;
  can_manage_purchases?: boolean;
  can_manage_inventory?: boolean;
  can_manage_customers?: boolean;
  can_manage_suppliers?: boolean;
  can_manage_employees?: boolean;
  can_manage_reports?: boolean;
  can_manage_settings?: boolean;
  can_manage_backup?: boolean;
  can_export_data?: boolean;
  can_import_data?: boolean;
  can_manage_roles?: boolean;
  can_view_audit_log?: boolean;
}

export interface LicenseResponse {
  success: boolean;
  license_key: string;
  tenant: Tenant;
  admin_password: string;
  message: string;
}

export interface LicenseValidate {
  valid: boolean;
  tenant?: Tenant;
  message: string;
  expiry_date?: string;
  days_left?: number;
}

// =============================================
// ✅ أنواع الإحصائيات
// =============================================

export interface SystemStats {
  total_tenants: number;
  active_tenants: number;
  inactive_tenants: number;
  expired_tenants: number;
  total_users: number;
  total_storage_mb: number;
  total_sales: number;
  total_profit: number;
  total_invoices: number;
  plan_distribution: {
    basic: number;
    pro: number;
    enterprise: number;
  };
  total_servers: number;
  online_servers: number;
  offline_servers: number;
  // ✅ ✅ ✅ الفروع
  total_branches?: number;
  online_branches?: number;
  offline_branches?: number;
  active_branches?: number;
  inactive_branches?: number;


}

// =============================================
// ✅ أنواع المستخدمين والمصادقة
// =============================================

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  is_system_admin: boolean;
  created_at: string;
  last_login: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// =============================================
// ✅ أنواع النشاطات
// =============================================

export interface ActivityLog {
  id: number;
  user_id: number;
  user?: User;
  action: string;
  module: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// =============================================
// ✅ أنواع الاستجابة العامة
// =============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// =============================================
// ✅ أنواع الفروع (Branches)
// =============================================

export interface Branch {
  id: number;
  tenant_id: number;
  branch_code: string;
  branch_name: string;
  arabic_name?: string | null;
  is_active: boolean;
  is_online: boolean;
  last_seen?: string | null;
  last_login?: string | null;
  device_name?: string | null;
  device_ip?: string | null;
  total_users: number;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
}

export interface BranchCreate {
  branch_name: string;
  arabic_name?: string;
}

export interface BranchUpdate {
  branch_name?: string;
  arabic_name?: string;
  is_active?: boolean;
  device_name?: string;
}

export interface BranchValidateResponse {
  valid: boolean;
  branch?: {
    id: number;
    branch_code: string;
    branch_name: string;
    arabic_name?: string;
    tenant_id: number;
    is_active: boolean;
    is_online: boolean;
  };
  tenant?: Tenant;
  message?: string;
}

export interface BranchHeartbeatData {
  device_name?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}