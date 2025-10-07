// Type-safe API Client for Frontend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ============================================
// TYPES (Generated from Backend)
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  instructorId: string;
  isPublished: boolean;
  estimatedDuration?: number;
  price?: number;
  isFree: boolean;
  tags: string[];
  requirements: string[];
  learningPoints: string[];
  createdAt: string;
  updatedAt: string;
  instructor?: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// API CLIENT CLASS
// ============================================

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  private saveToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  private removeToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(error.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============================================
  // AUTH ENDPOINTS
  // ============================================

  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  }): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.saveToken(response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.saveToken(response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.removeToken();
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const tokens = await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.saveToken(tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return tokens;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // ============================================
  // COURSES ENDPOINTS
  // ============================================

  async getCourses(params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    isFree?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Course>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    return this.request<PaginatedResponse<Course>>(
      `/courses${query ? `?${query}` : ''}`
    );
  }

  async getCourse(id: string): Promise<Course> {
    return this.request<Course>(`/courses/${id}`);
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    return this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    return this.request<Course>(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: string): Promise<void> {
    await this.request(`/courses/${id}`, { method: 'DELETE' });
  }

  async publishCourse(id: string, isPublished: boolean): Promise<Course> {
    return this.request<Course>(`/courses/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ isPublished }),
    });
  }

  // ============================================
  // ENROLLMENTS ENDPOINTS
  // ============================================

  async getEnrollments(): Promise<any[]> {
    return this.request<any[]>('/enrollments');
  }

  async enrollCourse(courseId: string): Promise<any> {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async getCourseProgress(courseId: string): Promise<any> {
    return this.request(`/enrollments/${courseId}/progress`);
  }

  async unenrollCourse(courseId: string): Promise<void> {
    await this.request(`/enrollments/${courseId}`, { method: 'DELETE' });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  setAccessToken(token: string) {
    this.saveToken(token);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const apiClient = new ApiClient(API_BASE_URL);

// ============================================
// COMPOSABLE FOR VUE
// ============================================

export function useApi() {
  return {
    client: apiClient,

    // Auth
    register: apiClient.register.bind(apiClient),
    login: apiClient.login.bind(apiClient),
    logout: apiClient.logout.bind(apiClient),
    refreshToken: apiClient.refreshToken.bind(apiClient),
    getCurrentUser: apiClient.getCurrentUser.bind(apiClient),

    // Courses
    getCourses: apiClient.getCourses.bind(apiClient),
    getCourse: apiClient.getCourse.bind(apiClient),
    createCourse: apiClient.createCourse.bind(apiClient),
    updateCourse: apiClient.updateCourse.bind(apiClient),
    deleteCourse: apiClient.deleteCourse.bind(apiClient),
    publishCourse: apiClient.publishCourse.bind(apiClient),

    // Enrollments
    getEnrollments: apiClient.getEnrollments.bind(apiClient),
    enrollCourse: apiClient.enrollCourse.bind(apiClient),
    getCourseProgress: apiClient.getCourseProgress.bind(apiClient),
    unenrollCourse: apiClient.unenrollCourse.bind(apiClient),
  };
}

export default apiClient;
