import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Site, 
  Category, 
  CreateSiteInput, 
  UpdateSiteInput, 
  SearchFilters, 
  ApiResponse 
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || '请求失败';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Sites API
export const sitesAPI = {
  getAll: async (filters: SearchFilters = {}) => {
    const { data } = await api.get<ApiResponse<Site[]>>('/sites', { params: filters });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<Site>>(`/sites/${id}`);
    return data;
  },

  create: async (siteData: CreateSiteInput) => {
    const { data } = await api.post<ApiResponse<Site>>('/sites', siteData);
    return data;
  },

  update: async (id: number, siteData: UpdateSiteInput) => {
    const { data } = await api.put<ApiResponse<Site>>(`/sites/${id}`, siteData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<{ deleted: boolean }>>(`/sites/${id}`);
    return data;
  },

  incrementClick: async (id: number) => {
    const { data } = await api.post<ApiResponse<{ incremented: boolean }>>(`/sites/${id}/click`);
    return data;
  },

  getPopular: async () => {
    const { data } = await api.get<ApiResponse<Site[]>>('/sites/popular');
    return data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data;
  },

  getAllWithCount: async () => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories/with-count');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return data;
  },

  create: async (categoryData: Omit<Category, 'id'>) => {
    const { data } = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return data;
  },

  update: async (id: number, categoryData: Partial<Omit<Category, 'id'>>) => {
    const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<{ deleted: boolean }>>(`/categories/${id}`);
    return data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const { data } = await api.get('/health');
    return data;
  },
};

export default api; 