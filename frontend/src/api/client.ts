const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('meddoc_token') || localStorage.getItem('pharmapulse_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('meddoc_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('meddoc_token');
  localStorage.removeItem('meddoc_user');
  localStorage.removeItem('pharmapulse_token');
  localStorage.removeItem('pharmapulse_user');
};

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Network request failed');
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: any) => fetchAPI<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => fetchAPI<any>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: (role: string) => fetchAPI<any>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getProfile: () => fetchAPI<any>('/auth/me'),

  // Dashboard
  getDashboardOverview: () => fetchAPI<any>('/dashboard/overview'),

  // Spikes
  getSpikes: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/spikes${query ? `?${query}` : ''}`);
  },
  getSpikeById: (id: string) => fetchAPI<any>(`/spikes/${id}`),
  updateSpikeStatus: (id: string, status: string) =>
    fetchAPI<any>(`/spikes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  runSpikeAnalysis: () => fetchAPI<any>('/spikes/analyze'),

  // Demand
  getDemand: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/demand${query ? `?${query}` : ''}`);
  },
  getDemandComparison: (medicineIds: string[]) =>
    fetchAPI<any>(`/demand/compare?medicineIds=${medicineIds.join(',')}`),

  // Forecasting
  getForecasts: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/forecasting${query ? `?${query}` : ''}`);
  },

  // Geographic
  getGeographicData: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/geographic${query ? `?${query}` : ''}`);
  },

  // Inventory
  getInventory: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/inventory${query ? `?${query}` : ''}`);
  },
  updateStock: (id: string, payload: { currentStock?: number; reorderLevel?: number }) =>
    fetchAPI<any>(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getTransferRecommendations: () => fetchAPI<any>('/inventory/transfers'),

  // Insights & Copilot
  getAIInsights: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/insights${query ? `?${query}` : ''}`);
  },
  getCorrelations: () => fetchAPI<any>('/insights/correlations'),
  queryCopilot: (query: string) =>
    fetchAPI<any>('/insights/copilot', { method: 'POST', body: JSON.stringify({ query }) }),

  // Pharmacies & Medicines
  getPharmacies: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/pharmacies${query ? `?${query}` : ''}`);
  },
  getPharmacyById: (id: string) => fetchAPI<any>(`/pharmacies/${id}`),
  getMedicines: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI<any>(`/medicines${query ? `?${query}` : ''}`);
  },

  // Reports
  getReports: () => fetchAPI<any>('/reports'),
  generateReport: (payload: any) =>
    fetchAPI<any>('/reports/generate', { method: 'POST', body: JSON.stringify(payload) }),

  // Ingestion & Simulator
  ingestCSV: (csvData: string) =>
    fetchAPI<any>('/ingest/csv', { method: 'POST', body: JSON.stringify({ csvData }) }),
  simulateSurge: (payload: { city?: string; medicineName?: string; surgeMagnitude?: number }) =>
    fetchAPI<any>('/ingest/simulate-surge', { method: 'POST', body: JSON.stringify(payload) }),
};
