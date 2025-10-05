import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import UserDropdown from '../components/UserDropdown';
import type { 
  Task, 
  TaskStats, 
  TaskStatus, 
  TaskPriority,
  CreateTaskRequest, 
  UpdateTaskRequest,
  LoadingState 
} from '../types';
import { apiService } from '../services/api';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  
  const [dashboardLoading, setDashboardLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      
      const params = {
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(priorityFilter !== 'ALL' && { priority: priorityFilter }),
      };
      
      const response:any = await apiService.getTasks(params);
      // Handle both old and new response formats
      const tasksData = response.data?.tasks || response.tasks || [];
      setTasks(tasksData);
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks' 
      });
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Fetch task statistics
  const fetchTaskStats = async () => {
    try {
      setDashboardLoading({ isLoading: true, error: null });
      const response:any = await apiService.getTaskStats();
      // Handle both old and new response formats
      const statsData = response.data?.stats || response.stats || {
        totalTasks: 0,
        todoTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
      };
      setTaskStats(statsData);
    } catch (error) {
      setDashboardLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch statistics' 
      });
    } finally {
      setDashboardLoading(prev => ({ ...prev, isLoading: false }));
    }
  };
  console.log(taskStats);
  // Initial data fetch
  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, []);

  // Refetch tasks when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, priorityFilter]);

  // Handle task creation
  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      setIsFormLoading(true);
      const response:any = await apiService.createTask(taskData);
      
      // Handle both old and new response formats
      const newTask = response.data.task || response.task;
      if (newTask) {
        setTasks(prev => [newTask, ...prev]);
        setIsFormOpen(false);
        fetchTaskStats(); // Refresh stats
      }
    } catch (error) {
      throw error; // Let the form handle the error
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskData: UpdateTaskRequest) => {
    if (!editingTask) return;
    
    try {
      setIsFormLoading(true);
      const response:any = await apiService.updateTask(editingTask.id, taskData);
      
      // Handle both old and new response formats
      const updatedTask = response.data?.task || response.task;
      if (updatedTask) {
        setTasks(prev => 
          prev.map(task => 
            task.id === editingTask.id ? updatedTask : task
          )
        );
        setIsFormOpen(false);
        setEditingTask(null);
        fetchTaskStats(); // Refresh stats
      }
    } catch (error) {
      throw error; // Let the form handle the error
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    console.log('handleDeleteTask called with taskId:', taskId);
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      fetchTaskStats(); // Refresh stats
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    console.log('handleStatusChange called with taskId:', taskId, 'status:', status);
    try {
      const response:any = await apiService.updateTask(taskId, { status });
      
      // Handle both old and new response formats
      const updatedTask = response.data?.task || response.task;
      if (updatedTask) {
        setTasks(prev => 
          prev.map(task => 
            task.id === taskId ? updatedTask : task
          )
        );
        fetchTaskStats(); // Refresh stats
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update task status');
    }
  };

  // Handle form submission
  const handleFormSubmit = async (taskData: CreateTaskRequest | UpdateTaskRequest) => {
    if (editingTask) {
      await handleUpdateTask(taskData as UpdateTaskRequest);
    } else {
      await handleCreateTask(taskData as CreateTaskRequest);
    }
  };

  // Handle opening create form
  const handleOpenCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // Handle opening edit form
  const handleOpenEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Handle closing form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Title and User Dropdown */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
            <p className="text-gray-600">Manage your tasks efficiently</p>
          </div>
          <UserDropdown />
        </div>

        <div className="space-y-8">
          <Dashboard 
            stats={taskStats}
            isLoading={dashboardLoading.isLoading}
            error={dashboardLoading.error}
          />

          <TaskList
            tasks={tasks}
            isLoading={loadingState.isLoading}
            error={loadingState.error}
            onCreateTask={handleOpenCreateForm}
            onEditTask={handleOpenEditForm}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onSearch={setSearchQuery}
            onFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
          />
        </div>

        <TaskForm
          task={editingTask}
          isOpen={isFormOpen}
          isLoading={isFormLoading}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      </div>
    </div>
  );
};

export default HomePage;