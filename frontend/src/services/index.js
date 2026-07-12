import api from './api';

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
};

export const assetApi = {
  list: (params) => api.get('/assets', { params }),
  getById: (id) => api.get(`/assets/${id}`),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.patch(`/assets/${id}`, data),
  transition: (id, toStatus, reason) => api.post(`/assets/${id}/transition`, { toStatus, reason }),
  stats: () => api.get('/assets/stats/summary'),
};

export const masterApi = {
  dashboard: () => api.get('/dashboard/overview'),
  departments: () => api.get('/departments'),
  locations: () => api.get('/locations'),
  categories: () => api.get('/categories'),
  vendors: () => api.get('/vendors'),
  notifications: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};

export const assignmentApi = {
  listRequests: (params) => api.get('/assignments/requests', { params }),
  createRequest: (data) => api.post('/assignments/requests', data),
  approveRequest: (id, data) => api.post(`/assignments/requests/${id}/approve`, data),
  rejectRequest: (id, rejectionReason) =>
    api.post(`/assignments/requests/${id}/reject`, { rejectionReason }),
  list: (params) => api.get('/assignments', { params }),
  my: () => api.get('/assignments/my'),
  returnAssignment: (id, data) => api.post(`/assignments/${id}/return`, data),
};
