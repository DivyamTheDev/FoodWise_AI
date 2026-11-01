import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventoryApi = {
  getAll: (params) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (item) => api.post('/inventory', item),
  update: (id, item) => api.put(`/inventory/${id}`, item),
  delete: (id) => api.delete(`/inventory/${id}`),
  consume: (id, quantityToConsume) => api.post(`/inventory/${id}/consume`, { quantityToConsume }),
  seedDummy: () => api.post('/inventory/seed'),
  getStatus: () => api.get('/inventory/status'),
};

export const alertsApi = {
  getAlerts: () => api.get('/alerts'),
};

export const recipeApi = {
  getSaved: () => api.get('/recipes'),
  generate: (payload) => api.post('/recipes/generate', payload),
  save: (recipe) => api.post('/recipes/save', recipe),
  toggleFavorite: (id) => api.patch(`/recipes/${id}/favorite`),
  delete: (id) => api.delete(`/recipes/${id}`),
  cook: (usedIngredients) => api.post('/recipes/cook', { usedIngredients }),
};

export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
