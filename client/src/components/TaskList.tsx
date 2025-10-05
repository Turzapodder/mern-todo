import React from 'react';
import type { TaskListProps } from '../types';
import { TaskStatus, TaskPriority } from '../types';

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  error,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onSearch,
  onFilterChange,
  searchQuery,
  statusFilter,
}) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-danger-100 text-danger-800 border-danger-200';
      case TaskPriority.MEDIUM:
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case TaskPriority.LOW:
        return 'bg-success-100 text-success-800 border-success-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    console.log(status);
    switch (status) {
      case 'todo':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      case 'in-progress':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'in-review':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'done':
        return 'bg-success-100 text-success-800 border-success-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center text-danger-600">
          <p>Error loading tasks: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <button onClick={onCreateTask} className="btn btn-primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="input w-full"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value as TaskStatus | 'ALL')}
            className="input w-full"
          >
            <option value="ALL">All Status</option>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.IN_REVIEW}>In Review</option>
            <option value={TaskStatus.DONE}>Completed</option>
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm mt-1">Create your first task to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                isOverdue(task.dueDate) ? 'border-danger-200 bg-danger-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 flex-1">{task.title}</h3>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>Created: {formatDate(task.createdAt)}</span>
                    {task.dueDate && (
                      <span className={isOverdue(task.dueDate) ? 'text-danger-600 font-medium' : ''}>
                        Due: {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && ' (Overdue)'}
                      </span>
                    )}
                    {task.assignedUser && <span>Assigned: {task.assignedUser}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.IN_REVIEW}>In Review</option>
                    <option value={TaskStatus.DONE}>Completed</option>
                  </select>
                  
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Edit task"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => {console.log(task);onDeleteTask(task.id)}}
                    className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                    title="Delete task"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;