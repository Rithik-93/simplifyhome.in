import type { 
  CMSItem, 
  CMSCategory, 
  CMSUser, 
  CreateItemRequest, 
  UpdateItemRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateUserRequest,
  UpdateUserRequest,
  GetItemsRequest,
  DashboardStats
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_PUBLIC_API_URL ? import.meta.env.VITE_PUBLIC_API_URL + '/api' : null) || 
  'http://localhost:3000/api';

class CMSApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/cms${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ==================== ITEMS API ====================

  async getItems(params: GetItemsRequest = {}): Promise<{
    success: boolean;
    data: CMSItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.type) queryParams.append('type', params.type);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const queryString = queryParams.toString();
    const endpoint = `/items${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getItem(id: string): Promise<{
    success: boolean;
    data: CMSItem;
  }> {
    return this.request(`/items/${id}`);
  }

  async createItem(itemData: CreateItemRequest): Promise<{
    success: boolean;
    data: CMSItem;
    message: string;
  }> {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateItem(id: string, itemData: UpdateItemRequest): Promise<{
    success: boolean;
    data: CMSItem;
    message: string;
  }> {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteItem(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CATEGORIES API ====================

  async getCategories(): Promise<{
    success: boolean;
    data: CMSCategory[];
  }> {
    return this.request('/categories');
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<{
    success: boolean;
    data: CMSCategory;
    message: string;
  }> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<{
    success: boolean;
    data: CMSCategory;
    message: string;
  }> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== USERS API ====================

  async getUsers(): Promise<{
    success: boolean;
    data: CMSUser[];
  }> {
    return this.request('/users');
  }

  async createUser(userData: CreateUserRequest): Promise<{
    success: boolean;
    data: CMSUser;
    message: string;
  }> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<{
    success: boolean;
    data: CMSUser;
    message: string;
  }> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== DASHBOARD API ====================

  async getDashboardStats(): Promise<{
    success: boolean;
    data: DashboardStats;
  }> {
    return this.request('/dashboard/stats');
  }

  // ==================== CONVENIENCE METHODS FOR MAIN APP ====================

  // Get active furniture items for main app
  async getActiveFurnitureItems(): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({
        type: 'furniture',
        isActive: true,
        limit: 1000 // Get all active items
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching active furniture items:', error);
      return [];
    }
  }

  // Get active single line items for main app
  async getActiveSingleLineItems(): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({
        type: 'singleLine',
        isActive: true,
        limit: 1000 // Get all active items
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching active single line items:', error);
      return [];
    }
  }

  // Get active service items for main app
  async getActiveServiceItems(): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({
        type: 'service',
        isActive: true,
        limit: 1000 // Get all active items
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching active service items:', error);
      return [];
    }
  }
}

export const cmsApi = new CMSApiService();
export default cmsApi; 