import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button } from '../components/ui';

const Dashboard = () => {
  // Demo data
  const stats = [
    { name: 'Total Employees', value: '145' },
    { name: 'Departments', value: '12' },
    { name: 'Projects', value: '18' },
    { name: 'Employee Attendance', value: '92%' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Logged in', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '10 minutes ago' },
    { id: 3, user: 'Alex Johnson', action: 'Submitted leave request', time: '22 minutes ago' },
    { id: 4, user: 'Sarah Williams', action: 'Created new project', time: '1 hour ago' },
    { id: 5, user: 'Mike Brown', action: 'Approved timesheet', time: '2 hours ago' },
  ];

  return (
    <MainLayout>
      {/* Page header */}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl leading-6 font-semibold text-gray-900">Dashboard</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Button variant="primary" size="small">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stat.value}
              </dd>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {activity.user}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="text-sm text-gray-500">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="light" fullWidth>Add Employee</Button>
          <Button variant="light" fullWidth>Manage Attendance</Button>
          <Button variant="light" fullWidth>Process Payroll</Button>
          <Button variant="light" fullWidth>View Reports</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;