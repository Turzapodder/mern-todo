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
  onPriorityFilterChange,
  searchQuery,
  statusFilter,
  priorityFilter,
}) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200 shadow-red-100'; 
      case TaskPriority.MEDIUM:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200 shadow-amber-100'; 
      case TaskPriority.LOW:
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 shadow-green-100'; 
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200 shadow-gray-100'; 
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200';
      case TaskStatus.IN_PROGRESS:
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200';
      case TaskStatus.IN_REVIEW:
        return 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200';
      case TaskStatus.DONE:
        return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium mb-2">Error loading tasks</p>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Tasks
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your tasks efficiently</p>
        </div>
        <button 
          onClick={onCreateTask} 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value as TaskStatus | 'ALL')}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value={TaskStatus.TODO}>To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.IN_REVIEW}>In Review</option>
          <option value={TaskStatus.DONE}>Completed</option>
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriority | 'ALL')}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="ALL">All Priority</option>
          <option value={TaskPriority.HIGH}>High Priority</option>
          <option value={TaskPriority.MEDIUM}>Medium Priority</option>
          <option value={TaskPriority.LOW}>Low Priority</option>
        </select>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-6">Create your first task to get started on your journey</p>
          <button 
            onClick={onCreateTask}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create First Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isOverdue(task.dueDate) 
                  ? 'border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 shadow-red-100' 
                  : 'border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white shadow-lg'
              }`}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col items-start gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900 flex-1 text-lg leading-tight">{task.title}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border shadow-sm ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Created {formatDate(task.createdAt)}</span>
                      </div>
                      {task.dueDate && (
                        <div className={`flex items-center gap-1.5 ${isOverdue(task.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            Due {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate) && ' (Overdue)'}
                          </span>
                        </div>
                      )}
                      {task.assignedUser && (
                        <div className="flex items-center gap-1.5 py-1 px-4 text-black rounded-full bg-purple-300 ">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{task.assignedUser}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                      className={`text-sm border rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${getStatusColor(task.status)}`}
                    >
                      <option value={TaskStatus.TODO}>To Do</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.IN_REVIEW}>In Review</option>
                      <option value={TaskStatus.DONE}>Completed</option>
                    </select>

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/edit"
                      title="Edit task"
                    >
                      <svg className="w-5 h-5 group-hover/edit:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/delete"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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