import type {
  TaskResponse,
  TaskStatsResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQueryParams,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UsersResponse,
} from '../types';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
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

    if (this.token) {
(headers as Record<string, string>).Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUsers(): Promise<UsersResponse> {
    return this.request<UsersResponse>('/auth/users');
  }

  // Task methods
  async getTasks(params?: TaskQueryParams): Promise<TaskResponse> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    const response = await this.request<TaskResponse>(endpoint);
    console.log('getTasks response:', response);
    return response;
  }

  async getTask(id: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/tasks/${id}`);
  }

  async createTask(taskData: CreateTaskRequest): Promise<TaskResponse> {
    return this.request<TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTaskStats(): Promise<TaskStatsResponse> {
    return this.request<TaskStatsResponse>('/tasks/stats');
  }
}

export const apiService = new ApiService();
export default apiService;