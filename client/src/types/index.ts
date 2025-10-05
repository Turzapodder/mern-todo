// Task related types
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  IN_REVIEW: 'in-review',
  DONE: 'done'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedUser?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: TaskPriority;
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
  dueDate: string;
  labels: string[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedUser?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedUser?: string;
}

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  users?: User[];
}

export interface TaskResponse {
  success: boolean;
  message: string;
  task?: Task;
  tasks?: Task[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TaskStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface TaskStatsResponse {
  success: boolean;
  message: string;
  stats?: TaskStats;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedUser?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Component Props Types
export interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSearch: (query: string) => void;
  onFilterChange: (status: TaskStatus | 'ALL') => void;
  onPriorityFilterChange: (priority: TaskPriority | 'ALL') => void;
  searchQuery: string;
  statusFilter: TaskStatus | 'ALL';
  priorityFilter: TaskPriority | 'ALL';
}

export interface TaskFormProps {
  task?: Task | null;
  isOpen: boolean;
  isLoading: boolean;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  onClose: () => void;
}

export interface DashboardProps {
  stats: any;
  isLoading: boolean;
  error: string | null;
}

export interface TaskStatusFilterProps {
  activeFilter: TaskStatus | 'ALL';
  onFilterChange: (status: TaskStatus | 'ALL') => void;
  stats: TaskStats;
  className?: string;
}

export const priorityColors = {
        HIGH: 'bg-red-500',
        MEDIUM: 'bg-yellow-500',
        LOW: 'bg-green-500',
    };