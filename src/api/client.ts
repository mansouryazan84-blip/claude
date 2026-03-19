import type { PaginatedResponse, QueryParams } from '@/types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('wms_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('wms_token');
    localStorage.removeItem('wms_user');
    window.location.href = '/login';
    throw new ApiError(401, 'انتهت جلسة العمل، يرجى تسجيل الدخول مجدداً');
  }

  let data: unknown;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const err = data as { message?: string; errors?: Record<string, string[]> };
    throw new ApiError(
      response.status,
      err.message || 'حدث خطأ غير متوقع',
      err.errors,
    );
  }

  return data as T;
}

function buildQueryString(params: QueryParams = {}): string {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  );
  const qs = new URLSearchParams(clean as Record<string, string>).toString();
  return qs ? `?${qs}` : '';
}

// ─── Auth ─────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: unknown; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: { name: string; email: string; password: string }) =>
    request<{ user: unknown; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  me: () => request<unknown>('/auth/me'),
};

// ─── Items ────────────────────────────────────────────────
export const itemsApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/items${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/items/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) =>
    request<unknown>(`/api/v1/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/v1/items/${id}`, { method: 'DELETE' }),
  categories: () => request<unknown[]>('/api/v1/items/categories'),
};

// ─── Inventory / Stock ────────────────────────────────────
export const inventoryApi = {
  stock: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/inventory${buildQueryString(params)}`),
  movements: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/inventory/movements${buildQueryString(params)}`),
  adjust: (data: unknown) =>
    request<unknown>('/api/v1/inventory/adjust', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Transfers ────────────────────────────────────────────
export const transfersApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/transfers${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/transfers/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/transfers', { method: 'POST', body: JSON.stringify(data) }),
  approve: (id: string) =>
    request<unknown>(`/api/v1/transfers/${id}/approve`, { method: 'POST' }),
  complete: (id: string) =>
    request<unknown>(`/api/v1/transfers/${id}/complete`, { method: 'POST' }),
  cancel: (id: string) =>
    request<unknown>(`/api/v1/transfers/${id}/cancel`, { method: 'POST' }),
};

// ─── Warehouses ───────────────────────────────────────────
export const warehousesApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/warehouses${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/warehouses/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/warehouses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) =>
    request<unknown>(`/api/v1/warehouses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Suppliers & Customers ────────────────────────────────
export const contactsApi = {
  suppliers: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/contacts?type=supplier${buildQueryString(params)}`),
  customers: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/contacts?type=customer${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/contacts/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) =>
    request<unknown>(`/api/v1/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Purchases ────────────────────────────────────────────
export const purchasesApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/purchases${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/purchases/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/purchases', { method: 'POST', body: JSON.stringify(data) }),
  approve: (id: string) =>
    request<unknown>(`/api/v1/purchases/${id}/approve`, { method: 'POST' }),
  receive: (id: string, data: unknown) =>
    request<unknown>(`/api/v1/purchases/${id}/receive`, { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Sales ────────────────────────────────────────────────
export const salesApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/sales${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/sales/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/sales', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Employees ────────────────────────────────────────────
export const employeesApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/employees${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/employees/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/employees', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) =>
    request<unknown>(`/api/v1/employees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  attendance: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/employees/attendance${buildQueryString(params)}`),
  checkIn: (employeeId: string) =>
    request<unknown>('/api/v1/employees/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    }),
};

// ─── Fleet ────────────────────────────────────────────────
export const fleetApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/fleet${buildQueryString(params)}`),
  get: (id: string) => request<unknown>(`/api/v1/fleet/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/v1/fleet', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) =>
    request<unknown>(`/api/v1/fleet/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Dashboard ────────────────────────────────────────────
export const dashboardApi = {
  stats: () => request<unknown>('/api/v1/dashboard/stats'),
  salesChart: (period?: string) =>
    request<unknown>(`/api/v1/dashboard/sales-chart${period ? `?period=${period}` : ''}`),
};

// ─── Audit ────────────────────────────────────────────────
export const auditApi = {
  list: (params?: QueryParams) =>
    request<PaginatedResponse<unknown>>(`/api/v1/audit${buildQueryString(params)}`),
};

export { ApiError };
export default request;
