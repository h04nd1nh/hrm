import React from 'react';
import PropTypes from 'prop-types';

/**
 * Layout chính cho ứng dụng
 */
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">HRM System</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Employees</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Departments</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">&copy; 2023 HRM System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout; 