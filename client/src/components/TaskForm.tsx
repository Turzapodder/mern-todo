import React, { useState, useEffect } from 'react';
import type { TaskFormProps, CreateTaskRequest, UpdateTaskRequest, User } from '../types';
import { TaskStatus, TaskPriority } from '../types';
import { apiService } from '../services/api';

const TaskForm: React.FC<TaskFormProps> = ({ task, isOpen, isLoading, onSubmit, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    assignedUser: string;
  }>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    assignedUser: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch users when form opens
  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen && users.length === 0) {
        setLoadingUsers(true);
        try {
          const response:any = await apiService.getUsers();
          if (response.success && response.data.users) {
            setUsers(response.data.users);
          }
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [isOpen, users.length]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedUser: task.assignedUser || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: '',
        assignedUser: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: CreateTaskRequest | UpdateTaskRequest = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      assignedUser: formData.assignedUser.trim() || undefined,
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input w-full ${errors.title ? 'border-danger-500' : ''}`}
                placeholder="Enter task title"
                disabled={isLoading}
              />
              {errors.title && <p className="text-sm text-danger-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="textarea w-full"
                placeholder="Enter task description"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input w-full"
                  disabled={isLoading}
                >
                  <option value={TaskStatus.TODO}>To Do</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.IN_REVIEW}>In Review</option>
                  <option value={TaskStatus.DONE}>Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input w-full"
                  disabled={isLoading}
                >
                  <option value={TaskPriority.LOW}>Low</option>
                  <option value={TaskPriority.MEDIUM}>Medium</option>
                  <option value={TaskPriority.HIGH}>High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="assignedUser" className="block text-sm font-medium text-gray-700 mb-1">
                Assigned User
              </label>
              <select
                id="assignedUser"
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleChange}
                className="input w-full"
                disabled={isLoading || loadingUsers}
              >
                <option value="">Select a user</option>
                {loadingUsers ? (
                  <option disabled>Loading users...</option>
                ) : (
                  users.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username} ({user.email})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {task ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  task ? 'Update Task' : 'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;