// Typed API client — replaces supabase.ts
// All requests go to /api (proxied by Vite to http://localhost:4000 in dev)

const API_BASE = '/api';
const TOKEN_KEY = 'callcenterx-auth-token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error || res.statusText);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// Auth
export const api = {
  auth: {
    register: (email: string, password: string, name: string) =>
      request<{ token: string; userId: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),

    login: (email: string, password: string) =>
      request<{ token: string; userId: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    me: () =>
      request<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: string;
        organizations: Array<{
          id: string;
          name: string;
          slug: string;
          createdAt: string;
          updatedAt: string;
        }>;
      }>('/auth/me'),
  },

  organizations: {
    create: (name: string, slug: string) =>
      request<{ id: string; name: string; slug: string }>('/organizations', {
        method: 'POST',
        body: JSON.stringify({ name, slug }),
      }),

    list: () =>
      request<Array<{ id: string; name: string; slug: string }>>('/organizations'),
  },

  calls: {
    list: (orgId: string) =>
      request<any[]>(`/calls?org_id=${encodeURIComponent(orgId)}`),

    create: (data: Record<string, string>) =>
      request<any>('/calls', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Record<string, any>) =>
      request<any>(`/calls/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  agents: {
    list: (orgId: string) =>
      request<any[]>(`/agents?org_id=${encodeURIComponent(orgId)}`),

    create: (data: Record<string, string>) =>
      request<any>('/agents', { method: 'POST', body: JSON.stringify(data) }),
  },
};
