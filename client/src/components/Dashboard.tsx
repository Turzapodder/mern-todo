import React from 'react';
import type { DashboardProps } from '../types';
import { AlertTriangle, CheckCircle2, ClipboardList, ListChecks, Loader } from 'lucide-react';

const Dashboard: React.FC<DashboardProps> = ({ stats, isLoading, error }) => {
  console.log(stats);
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center text-danger-600">
          <p>Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

 const statCards = [
  {
    title: "Total Tasks",
    value: stats.total,
    icon: ListChecks, // represents total tasks
  },
  {
    title: "To Do",
    value: stats.byStatus.todo || '0',
    icon: ClipboardList , // pending or planned tasks
  },
  {
    title: "In Progress",
    value: stats.byStatus.inProgress  || '0',
    icon: Loader, // indicates something ongoing
  },
  {
    title: "Completed",
    value: stats.byStatus.done || '0',
    icon: CheckCircle2, // completed / success
  },
  {
    title: "Overdue",
    value: stats.overdue,
    icon: AlertTriangle, // warning / overdue
  },
];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center gap-6">
              <Icon className="w-6 h-full text-gray-700 flex items-center justify-center" />
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className='text-2xl font-bold text-center'>{stat.value}</p>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default Dashboard;