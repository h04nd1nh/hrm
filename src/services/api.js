// Cấu hình axios hoặc fetch API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Hàm gọi API chung
 * @param {string} endpoint - Đường dẫn API
 * @param {Object} options - Tùy chọn fetch
 * @returns {Promise} - Promise từ fetch API
 */
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Thêm các header khác nếu cần
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Kiểm tra response status
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Các phương thức HTTP tiện ích
export const apiService = {
  get: (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => fetchApi(endpoint, { 
    ...options, 
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data, options = {}) => fetchApi(endpoint, { 
    ...options, 
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'DELETE' }),
};

export default apiService; 