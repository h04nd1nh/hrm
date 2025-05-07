import { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { apiService } from '../services/api';

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
  const [user, setUser, removeUser] = useLocalStorage('user', null);
  const [token, setToken, removeToken] = useLocalStorage('token', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kiểm tra xem user đã đăng nhập chưa
  const isAuthenticated = !!token;

  // Hàm đăng nhập
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Gọi API đăng nhập - sử dụng endpoint thực tế của bạn
      const response = await apiService.post('/auth/login', credentials);
      
      // Lưu token và thông tin user
      setToken(response.token);
      setUser(response.user);
      
      return response;
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    removeToken();
    removeUser();
    // Có thể thêm các bước xử lý khác khi đăng xuất
  };

  // Kiểm tra token và lấy thông tin user khi refresh trang
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        // Gọi API để xác thực token - điều chỉnh theo endpoint thực tế của bạn
        const response = await apiService.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Cập nhật thông tin user nếu cần
        setUser(response.user);
      } catch (err) {
        console.error('Token invalid:', err);
        // Nếu token không hợp lệ, đăng xuất user
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Giá trị được provide cho context
  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 