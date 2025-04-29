// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de autenticação (token expirado, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const produtoService = {
  getAll: (page = 0, size = 12) => api.get(`/produtos?page=${page}&size=${size}`),
  getById: (id) => api.get(`/produtos/${id}`),
  create: (produto) => api.post('/produtos', produto),
  update: (id, produto) => api.put(`/produtos/${id}`, produto),
  delete: (id) => api.delete(`/produtos/${id}`),
  search: (query, page = 0, size = 12) => api.get(`/produtos/buscar?nome=${query}&page=${page}&size=${size}`)
};

export const pedidoService = {
  getAll: () => api.get('/pedidos'),
  getById: (id) => api.get(`/pedidos/${id}`),
  create: (pedido) => api.post('/pedidos', pedido),
  updateStatus: (id, status) => api.put(`/pedidos/${id}/status?status=${status}`),
  getByEmail: (email) => api.get(`/pedidos/cliente/${email}`)
};

export const agendamentoService = {
  getAll: () => api.get('/agendamentos'),
  getById: (id) => api.get(`/agendamentos/${id}`),
  create: (agendamento) => api.post('/agendamentos', agendamento),
  update: (id, agendamento) => api.put(`/agendamentos/${id}`, agendamento),
  delete: (id) => api.delete(`/agendamentos/${id}`),
  getByPeriodo: (inicio, fim) => api.get(`/agendamentos/periodo?inicio=${inicio}&fim=${fim}`)
};

export default api;