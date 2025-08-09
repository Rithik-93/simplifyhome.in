import type { CMSItem, CMSCategory, CMSResponse } from '../types'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_PUBLIC_API_URL ? import.meta.env.VITE_PUBLIC_API_URL + '/api' : null) || 
  'http://localhost:3000/api'

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<CMSResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

// Items API
export const itemsAPI = {
  // Get all items with pagination
  getItems: async (page = 1, limit = 10, filters?: any): Promise<CMSResponse<CMSItem[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })
    return apiRequest<CMSItem[]>(`/items?${params}`)
  },

  // Get single item by ID
  getItem: async (id: string): Promise<CMSResponse<CMSItem>> => {
    return apiRequest<CMSItem>(`/items/${id}`)
  },

  // Create new item
  createItem: async (item: Omit<CMSItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSResponse<CMSItem>> => {
    return apiRequest<CMSItem>('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    })
  },

  // Update item
  updateItem: async (id: string, item: Partial<CMSItem>): Promise<CMSResponse<CMSItem>> => {
    return apiRequest<CMSItem>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    })
  },

  // Delete item
  deleteItem: async (id: string): Promise<CMSResponse<void>> => {
    return apiRequest<void>(`/items/${id}`, {
      method: 'DELETE',
    })
  }
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async (): Promise<CMSResponse<CMSCategory[]>> => {
    return apiRequest<CMSCategory[]>('/categories')
  },

  // Get single category by ID
  getCategory: async (id: string): Promise<CMSResponse<CMSCategory>> => {
    return apiRequest<CMSCategory>(`/categories/${id}`)
  },

  // Create new category
  createCategory: async (category: Omit<CMSCategory, 'id'>): Promise<CMSResponse<CMSCategory>> => {
    return apiRequest<CMSCategory>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
  },

  // Update category
  updateCategory: async (id: string, category: Partial<CMSCategory>): Promise<CMSResponse<CMSCategory>> => {
    return apiRequest<CMSCategory>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    })
  },

  // Delete category
  deleteCategory: async (id: string): Promise<CMSResponse<void>> => {
    return apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    })
  }
}

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<CMSResponse<any>> => {
    return apiRequest<any>('/dashboard/stats')
  },

  // Get recent activity
  getRecentActivity: async (): Promise<CMSResponse<any[]>> => {
    return apiRequest<any[]>('/dashboard/recent-activity')
  }
}

// Email API
export const emailAPI = {
  sendEstimate: async (payload: {
    to: string
    subject?: string
    text?: string
    html?: string
    fileName?: string
    fileBase64: string // base64 of PDF without data URI prefix
  }): Promise<CMSResponse<any>> => {
    return apiRequest<any>('/email/send-estimate', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }
}



export default {
  items: itemsAPI,
  categories: categoriesAPI,
  dashboard: dashboardAPI,
  email: emailAPI,
} 