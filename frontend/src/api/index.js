import apiClient from './client';

export const authAPI = {
  login: (data) => apiClient.post('/auth/login/', data),
  register: (data) => apiClient.post('/auth/register/', data),
  me: () => apiClient.get('/auth/me/'),
  logout: (refresh) => apiClient.post('/auth/logout/', { refresh }),
};

export const providerAPI = {
  getProviders: () => apiClient.get('/providers/'),
  getGuides: (params) => apiClient.get('/provider-guides/', { params }),
  updateGuide: (id, data) => apiClient.patch(`/provider-guides/${id}/`, data),
};

export const channelAPI = {
  getChannels: () => apiClient.get('/official-channels/'),
  updateChannel: (id, data) => apiClient.patch(`/official-channels/${id}/`, data),
};

export const incidentAPI = {
  classify: (data) => apiClient.post('/incidents/classify/', data),
  getIncidents: () => apiClient.get('/incidents/'),
  getIncident: (id) => apiClient.get(`/incidents/${id}/`),
  createIncident: (data) => apiClient.post('/incidents/', data),
  patchIncident: (id, data) => apiClient.patch(`/incidents/${id}/`, data),
  getActionPlan: (id) => apiClient.get(`/incidents/${id}/action-plan/`),
  toggleActionItem: (itemId, data) => apiClient.post(`/action-items/${itemId}/toggle_complete/`, data),
  getDraft: (id) => apiClient.get(`/incidents/${id}/complaint-draft/`),
};

export const complaintAPI = {
  getReferences: (incidentId) => apiClient.get('/references/', { params: { incident_id: incidentId } }),
  addReference: (data) => apiClient.post('/references/', data),
};

export const evidenceAPI = {
  getEvidence: (incidentId) => apiClient.get('/evidence/', { params: { incident_id: incidentId } }),
  uploadEvidence: (formData) => apiClient.post('/evidence/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteEvidence: (id) => apiClient.delete(`/evidence/${id}/`),
};

export const dashboardAPI = {
  getMetrics: () => apiClient.get('/admin/dashboard/'),
  getAuditLogs: () => apiClient.get('/audit-logs/'),
};
