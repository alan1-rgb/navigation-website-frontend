export interface Site {
  id: number;
  title: string;
  url: string;
  description?: string;
  favicon_url?: string;
  category_id?: number;
  category_name?: string;
  tags: string[];
  click_count: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  sort_order: number;
  site_count?: number;
}

export interface CreateSiteInput {
  title: string;
  url: string;
  description?: string;
  category_id?: number;
  tags?: string[];
}

export interface UpdateSiteInput {
  title?: string;
  url?: string;
  description?: string;
  category_id?: number;
  tags?: string[];
  status?: number;
}

export interface SearchFilters {
  keyword?: string;
  category?: number;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} 