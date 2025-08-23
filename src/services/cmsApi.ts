import type { 
  CMSItem, 
  CMSCategory, 
  CMSType,
  CMSUser, 
  CreateItemRequest, 
  UpdateItemRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTypeRequest,
  UpdateTypeRequest,
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
    
    console.log('CMS API Request:', { url, options })
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      console.log('CMS API Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('CMS API Error response:', errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('CMS API Response data:', data)
      
      return data;
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
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.typeId) queryParams.append('typeId', params.typeId);
    if (params.availableInRooms) {
      params.availableInRooms.forEach(roomType => {
        queryParams.append('availableInRooms', roomType);
      });
    }

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

  // ==================== TYPES API ====================

  async getTypes(): Promise<{
    success: boolean;
    data: CMSType[];
  }> {
    return this.request('/types');
  }

  async getType(id: string): Promise<{
    success: boolean;
    data: CMSType;
  }> {
    return this.request(`/types/${id}`);
  }

  async createType(typeData: CreateTypeRequest): Promise<{
    success: boolean;
    data: CMSType;
    message: string;
  }> {
    return this.request('/types', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  }

  async updateType(id: string, typeData: UpdateTypeRequest): Promise<{
    success: boolean;
    data: CMSType;
    message: string;
  }> {
    return this.request(`/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(typeData),
    });
  }

  async deleteType(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/types/${id}`, {
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

  async getCategoriesByType(typeId: string): Promise<{
    success: boolean;
    data: CMSCategory[];
  }> {
    return this.request(`/categories?typeId=${typeId}`);
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

  // Backwards-compat helpers used by the main app
  async getActiveFurnitureItems(): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({ limit: 1000 });
      return (response.data || []).filter(i => (i as any).category?.type?.name?.toLowerCase().includes('woodwork'));
    } catch (error) {
      console.error('Error fetching furniture items:', error);
      return [];
    }
  }

  async getActiveSingleLineItems(): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({ limit: 1000 });
      return (response.data || []).filter(i => (i as any).category?.type?.name?.toLowerCase().includes('single line'));
    } catch (error) {
      console.error('Error fetching single line items:', error);
      return [];
    }
  }

  async getActiveServiceItems(): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({ limit: 1000 });
      return (response.data || []).filter(i => (i as any).category?.type?.name?.toLowerCase().includes('service'));
    } catch (error) {
      console.error('Error fetching service items:', error);
      return [];
    }
  }

  // New helpers
  async getItemsByRoomType(roomType: string): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({
        availableInRooms: [roomType as any],
        limit: 1000
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for room type ${roomType}:`, error);
      return [];
    }
  }

  async getItemsByCategory(categoryId: string): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({ categoryId, limit: 1000 });
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for category ${categoryId}:`, error);
      return [];
    }
  }

  async getItemsByType(typeId: string): Promise<CMSItem[]> {
    try {
      const response = await this.getItems({ typeId, limit: 1000 });
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for type ${typeId}:`, error);
      return [];
    }
  }
}

export const cmsApi = new CMSApiService();
export default cmsApi; 