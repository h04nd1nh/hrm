import { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { authRepository } from '../repositories/authRepository';
import { showToast } from '../utils/toast';

// Tạo context
const AuthContext = createContext(null);

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [token, setToken, removeToken] = useLocalStorage('token', null);
  const [user, setUser] = useLocalStorage('user', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kiểm tra xem user đã đăng nhập chưa
  const isAuthenticated = !!token;
  
  // Hàm đăng nhập
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Sử dụng authRepository thay vì gọi trực tiếp API
      const response = await authRepository.signIn(credentials);
      
      console.log('Login response:', response); // Debug để xem cấu trúc response
      
      // Xử lý và lưu token
      if (response.accessToken) {
        // Lưu token vào localStorage
        setToken(response.accessToken);
        
        // Lưu thông tin user nếu có
        const userData = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
          // Các thông tin khác nếu có
        };
        setUser(userData);
        
        showToast.success('Đăng nhập thành công!');
        return response;
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Không tìm thấy access token trong response');
      }
    } catch (err) {
      // Lấy message từ response error
      let errorMessage = 'Đăng nhập thất bại';
      
      // Kiểm tra nếu có error data từ API
      if (err.data) {
        if (typeof err.data === 'object' && err.data.message) {
          errorMessage = err.data.message;
        } else if (typeof err.data === 'string') {
          errorMessage = err.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.log('Login error:', err);
      showToast.error(errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    removeToken();
    setUser(null);
  };

  // Hàm lấy role của user
  const getUserRole = () => {
    return user?.role;
  };

  // Giá trị được provide cho context
  const value = {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    getUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 