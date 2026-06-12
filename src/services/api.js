import axios from 'axios';

const BASE_URL = '/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('craftech_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/admin/login', data),
  getMe: () => api.get('/admin/me'),
  getStats: () => api.get('/admin/stats'),
  changePassword: (data) => api.patch('/admin/change-password', data),
};

// ── Projects ─────────────────────────────────────────────────────────────────
export const projectsApi = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addImages: (id, data) => api.post(`/projects/${id}/images`, data),
  removeImage: (id, imageIndex) => api.delete(`/projects/${id}/images/${imageIndex}`),
  addVideo: (id, data) => api.post(`/projects/${id}/videos`, data),
  removeVideo: (id, videoId) => api.delete(`/projects/${id}/videos/${videoId}`),
};

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadApi = {
  images: (slug, formData, onProgress) =>
    api.post(`/upload/${slug}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  video: (slug, formData, onProgress) =>
    api.post(`/upload/${slug}/video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  thumbnail: (slug, formData, onProgress) =>
    api.post(`/upload/${slug}/thumbnail`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  highlightVideo: (formData, onProgress) =>
    api.post('/upload/highlights/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  highlightThumbnail: (formData, onProgress) =>
    api.post('/upload/highlights/thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
};

// ── Content ───────────────────────────────────────────────────────────────────
export const contentApi = {
  getPillars: () => api.get('/content/pillars'),
  createPillar: (data) => api.post('/content/pillars', data),
  updatePillar: (id, data) => api.put(`/content/pillars/${id}`, data),
  deletePillar: (id) => api.delete(`/content/pillars/${id}`),

  getServices: () => api.get('/content/services'),
  createService: (data) => api.post('/content/services', data),
  updateService: (id, data) => api.put(`/content/services/${id}`, data),
  deleteService: (id) => api.delete(`/content/services/${id}`),

  getHighlightVideos: () => api.get('/content/highlight-videos'),
  createHighlightVideo: (data) => api.post('/content/highlight-videos', data),
  updateHighlightVideo: (id, data) => api.put(`/content/highlight-videos/${id}`, data),
  deleteHighlightVideo: (id) => api.delete(`/content/highlight-videos/${id}`),
};

// ── CMS ───────────────────────────────────────────────────────────────────────
export const cmsApi = {
  getHome: () => api.get('/cms/home'),
  updateHome: (data) => api.put('/cms/home', data),

  getSettings: () => api.get('/cms/settings'),
  updateSettings: (data) => api.put('/cms/settings', data),

  getTestimonials: () => api.get('/cms/testimonials'),
  createTestimonial: (data) => api.post('/cms/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/cms/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/cms/testimonials/${id}`),

  getClients: () => api.get('/cms/clients'),
  createClient: (data) => api.post('/cms/clients', data),
  updateClient: (id, data) => api.put(`/cms/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/cms/clients/${id}`),

  getLeads: () => api.get('/cms/leads'),
  getLeadsByStatus: () => api.get('/cms/leads/board/status'),
  createLead: (data) => api.post('/cms/leads', data),
  getProcessSteps: () => api.get('/cms/process-steps'),
  createProcessStep: (data) => api.post('/cms/process-steps', data),
  updateProcessStep: (id, data) => api.put(`/cms/process-steps/${id}`, data),
  deleteProcessStep: (id) => api.delete(`/cms/process-steps/${id}`),

  getWhyFeatures: () => api.get('/cms/why-features'),
  createWhyFeature: (data) => api.post('/cms/why-features', data),
  updateWhyFeature: (id, data) => api.put(`/cms/why-features/${id}`, data),
  deleteWhyFeature: (id) => api.delete(`/cms/why-features/${id}`),
  updateLead: (id, data) => api.put(`/cms/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/cms/leads/${id}`),

  getCTAs: () => api.get('/cms/ctas'),
  getCTABySection: (section) => api.get(`/cms/ctas/${section}`),
  createCTA: (data) => api.post('/cms/ctas', data),
  updateCTA: (id, data) => api.put(`/cms/ctas/${id}`, data),
  deleteCTA: (id) => api.delete(`/cms/ctas/${id}`),
};
