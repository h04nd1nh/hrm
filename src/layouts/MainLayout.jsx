import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/ui';

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
    <div className="bg-[#F4F9FD] flex flex-row h-screen w-screen justify-items-start">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full scrollbar-hide">
        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 w-full scrollbar-hide">
          <div className="w-full h-full flex-1 scrollbar-hide">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout; 