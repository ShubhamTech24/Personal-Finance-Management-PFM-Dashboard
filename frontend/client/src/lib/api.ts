const API_BASE = '/api';

let authToken: string | null = localStorage.getItem('auth_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken() {
  return authToken;
}

async function request(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    register: (email: string, password: string) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request('/auth/me'),
  },
  plaid: {
    createLinkToken: () => request('/plaid/create_link_token', { method: 'POST' }),
    setAccessToken: (public_token: string) =>
      request('/plaid/set_access_token', {
        method: 'POST',
        body: JSON.stringify({ public_token }),
      }),
    getTransactions: () => request('/plaid/transactions'),
    getAccounts: () => request('/plaid/accounts'),
  },
  budgets: {
    list: () => request('/budgets'),
    create: (category: string, monthlyLimit: number) =>
      request('/budgets', {
        method: 'POST',
        body: JSON.stringify({ category, monthlyLimit }),
      }),
    delete: (category: string) =>
      request(`/budgets/${category}`, { method: 'DELETE' }),
  },
  summary: {
    spendByCategory: () => request('/summary/spend-by-category'),
    monthlySummary: () => request('/summary/monthly-summary'),
  },
};
