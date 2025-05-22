import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path if your AuthContext is elsewhere

/**
 * A component that renders its children only if the current user is an Admin.
 * If the user is not authenticated or not an Admin, it renders null
 * or a fallback UI (e.g., a "Not Authorized" message or redirect).
 */
const UserOnly = ({ children, fallback = null }) => {
  const { isAuthenticated, getUserRole, isLoading } = useAuth();

  if (isLoading) {
    // Optional: render a loading indicator while auth state is being determined
    return <div>Loading...</div>; 
  }


  if (!isAuthenticated || getUserRole() !== "Employee") {
    return fallback; // Render nothing or a fallback component/message
  }

  return <>{children}</>;
};

export default UserOnly; 