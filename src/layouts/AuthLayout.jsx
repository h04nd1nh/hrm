import React from 'react';
import PropTypes from 'prop-types';

/**
 * Layout cho trang xác thực (đăng nhập, đăng ký)
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="bg-[#F4F9FD] flex flex-row h-screen w-screen justify-items-start">
    

    {/* Main content */}
    <div className="flex flex-col flex-1 overflow-hidden w-full">
      {/* Page content */}
      <main className="flex-1 overflow-auto w-full">
        <div className="w-full h-full flex-1">
          {children}
        </div>
      </main>
    </div>
  </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
