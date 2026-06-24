/**
 * Centralized API layer for backend communication
 * Handles authentication, error responses, and base URL configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Abort a request if the backend doesn't respond in time
const REQUEST_TIMEOUT_MS = 15000;

// Token storage keys
const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

/**
 * Standard API response format
 */
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
  meta?: any;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get stored auth token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set auth token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove auth token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get stored user data
 */
export const getStoredUser = (): any | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Set stored user data
 */
export const setStoredUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Make authenticated API request
 */
async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  

  // Add authorization header if token exists
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make request with a timeout so a hung backend doesn't spin forever
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for HTTP-only cookie support
      signal: controller.signal,
    });
  } catch (error) {
    // Network failure, CORS, or timeout — surface a human-readable message
    const message =
      error instanceof DOMException && error.name === 'AbortError'
        ? 'The request timed out. Please try again.'
        : 'Unable to reach the server. Please check your connection and try again.';
    throw new ApiError(message, 0);
  } finally {
    clearTimeout(timeout);
  }

  // Parse response
  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch (error) {
    throw new ApiError(
      'Failed to parse server response',
      response.status
    );
  }

  // Handle unauthorized/forbidden responses
  if (response.status === 401 || response.status === 403) {
    removeToken();
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    
    throw new ApiError(
      data.message || 'Unauthorized',
      response.status,
      data.errors
    );
  }

  // Handle other error responses
  if (!response.ok || !data.success) {
    throw new ApiError(
      data.message || 'Request failed',
      response.status,
      data.errors
    );
  }

  return data;
}

/**
 * API client object
 */
export const api = {
  /**
   * Admin authentication endpoints
   */
  admin: {
    /**
     * Login admin user
     */
    login: async (email: string, password: string) => {
      const response = await fetchApi<{ user: any; token: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store token and user data
      if (response.data?.token) {
        setToken(response.data.token);
        setStoredUser(response.data.user);
      }

      return response;
    },

    /**
     * Logout admin user
     */
    logout: async () => {
      try {
        await fetchApi('/admin/logout', { method: 'POST' });
      } finally {
        removeToken();
      }
    },

    /**
     * Get current admin user
     */
    me: async () => {
      return fetchApi<any>('/admin/me');
    },

    /**
     * Change password
     */
    changePassword: async (
      currentPassword: string,
      newPassword: string,
      confirmPassword: string
    ) => {
      return fetchApi('/admin/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
    },
  },

  /**
   * Car endpoints
   */
  cars: {
    /**
     * Get all cars (public)
     */
    getAll: async (filters?: any) => {
      const params = new URLSearchParams(filters).toString();
      return fetchApi(`/cars${params ? `?${params}` : ''}`);
    },

    /**
     * Get single car
     */
    getById: async (id: number) => {
      return fetchApi(`/cars/${id}`);
    },

    /**
     * Get all cars (admin - includes hidden)
     */
    getAllAdmin: async (filters?: any) => {
      const params = new URLSearchParams(filters).toString();
      return fetchApi(`/admin/cars${params ? `?${params}` : ''}`);
    },

    /**
     * Get distinct features and tags used across inventory (admin)
     */
    getMeta: async () => {
      return fetchApi<{ features: string[]; tags: string[] }>('/admin/cars/meta');
    },

    /**
     * Create car
     */
    create: async (carData: any) => {
      return fetchApi('/admin/cars', {
        method: 'POST',
        body: JSON.stringify(carData),
      });
    },

    /**
     * Update car
     */
    update: async (id: number, carData: any) => {
      return fetchApi(`/admin/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(carData),
      });
    },

    /**
     * Delete car
     */
    delete: async (id: number) => {
      return fetchApi(`/admin/cars/${id}`, {
        method: 'DELETE',
      });
    },

    /**
     * Upload car images
     */
    uploadImages: async (carId: number, files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/admin/cars/${carId}/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      return response.json();
    },

    /**
     * Delete car image
     */
    deleteImage: async (carId: number, imageId: number) => {
      return fetchApi(`/admin/cars/${carId}/images/${imageId}`, {
        method: 'DELETE',
      });
    },
  },

  /**
   * Lead endpoints
   */
  leads: {
    /**
     * Submit financing lead
     */
    submitFinancing: async (data: any) => {
      return fetchApi('/leads/financing', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    /**
     * Submit importation lead
     */
    submitImportation: async (data: any) => {
      return fetchApi('/leads/importation', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    /**
     * Submit contact message
     */
    submitContact: async (data: any) => {
      return fetchApi('/leads/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    /**
     * Get all leads (admin)
     */
    getAll: async (filters?: any) => {
      const params = new URLSearchParams(filters).toString();
      return fetchApi(`/admin/leads${params ? `?${params}` : ''}`);
    },

    /**
     * Update lead status
     */
    updateStatus: async (type: string, id: number, status: string) => {
      return fetchApi(`/admin/leads/${type}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    /**
     * Delete lead
     */
    delete: async (type: string, id: number) => {
      return fetchApi(`/admin/leads/${type}/${id}`, {
        method: 'DELETE',
      });
    },
  },

  /**
   * Stats endpoints
   */
  stats: {
    /**
     * Get dashboard stats
     */
    getDashboard: async () => {
      return fetchApi('/admin/stats');
    },

    /**
     * Get cars by category
     */
    getCarsByCategory: async () => {
      return fetchApi('/admin/stats/cars/category');
    },

    /**
     * Get cars by condition
     */
    getCarsByCondition: async () => {
      return fetchApi('/admin/stats/cars/condition');
    },

    /**
     * Get leads by status
     */
    getLeadsByStatus: async () => {
      return fetchApi('/admin/stats/leads/status');
    },

    /**
     * Get recent activity
     */
    getRecentActivity: async () => {
      return fetchApi('/admin/stats/activity');
    },
  },
};

export default api;
