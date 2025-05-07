import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Layout chính cho ứng dụng
 */
const MainLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              <Link to="/dashboard" className="text-gray-900 hover:text-blue-600">Dashboard</Link>
              <Link to="/employees" className="text-gray-500 hover:text-blue-600">Employees</Link>
              <Link to="/departments" className="text-gray-500 hover:text-blue-600">Departments</Link>
              <Link to="/settings" className="text-gray-500 hover:text-blue-600">Settings</Link>
            </nav>

            {/* User menu */}
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handleLogout}
                className="ml-3 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
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