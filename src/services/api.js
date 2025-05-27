// Cấu hình axios hoặc fetch API
import env from '../config/env';
import { showToast } from '../utils/toast';
import { getLocalStorage } from '../utils/storage';

const API_BASE_URL = env.API_BASE_URL;

/**
 * Lấy token xác thực từ các nguồn khác nhau
 * @returns {string|null} - Token xác thực hoặc null nếu không có
 */
const getAuthToken = () => {
  // 1. Ưu tiên lấy từ localStorage sử dụng hàm getLocalStorage có xử lý prefix
  const token = getLocalStorage('token');
  
  if (token) {
    return token;
  }
  
  // 2. Thử lấy từ cookie nếu không có trong localStorage
  // Hàm getCookie để lấy giá trị cookie theo tên
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  const cookieToken = getCookie('auth_token');
  return cookieToken;
};

/**
 * Interceptor cho request
 * @param {Object} config - Cấu hình request
 * @returns {Object} - Cấu hình request đã xử lý
 */
const requestInterceptor = (config) => {
  // Sử dụng token từ tham số nếu được cung cấp, ngược lại lấy từ các nguồn khác
  const token = config.authToken || getAuthToken();
  
  if (token) {
    // Thêm token vào header nếu có token
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  } else {
    console.log('[DEBUG] No token available, request will be sent without Authorization header');
  }
  
  // Xóa authToken khỏi config để không gửi lên server
  if (config.authToken) {
    delete config.authToken;
  }
  
  // Log request để debug
  if (env.NODE_ENV === 'development') {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      body: config.body,
    });
  }
  
  return config;
};

/**
 * Interceptor cho response
 * @param {Object} response - Response từ API
 * @returns {Object} - Response đã xử lý
 */
const responseInterceptor = async (response) => {
  // Clone response để không mutate response gốc
  const clonedResponse = response.clone();
  
  try {
    // Parse response để log hoặc xử lý
    const data = await clonedResponse.json();
    
    // Log response để debug
    if (env.NODE_ENV === 'development') {
      console.log('API Response:', {
        url: response.url,
        status: response.status,
        data,
      });
    }
    
    // Có thể xử lý response ở đây nếu cần
    // Ví dụ: hiển thị thông báo thành công, xử lý dữ liệu, v.v.
    
    // Trả về response gốc để tiếp tục xử lý
    return response;
  } catch (error) {
    // Nếu response không phải JSON, trả về response gốc
    return response;
  }
};

/**
 * Interceptor cho lỗi
 * @param {Object} error - Lỗi từ API
 * @returns {Object} - Xử lý lỗi và throw lại
 */
const errorInterceptor = (error) => {
  // Log lỗi để debug
  if (env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }
  
  // Xử lý các lỗi HTTP cụ thể
  if (error.status === 401) {
    // Unauthorized - có thể đăng xuất người dùng
    showToast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
    // Redirect tới trang login
    if (window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } else if (error.status === 403) {
    // Forbidden
    showToast.error('Bạn không có quyền truy cập tính năng này');
  } else if (error.status === 404) {
    // Not found
    showToast.error('Không tìm thấy tài nguyên yêu cầu');
  } else if (error.status >= 500) {
    // Server error
    showToast.error('Đã có lỗi xảy ra từ máy chủ, vui lòng thử lại sau');
  }
  
  // Throw lại lỗi để component xử lý tiếp
  throw error;
};

/**
 * Hàm gọi API chung
 * @param {string} endpoint - Đường dẫn API
 * @param {Object} options - Tùy chọn fetch
 * @param {string} [options.authToken] - Token xác thực tùy chọn, nếu không cung cấp sẽ dùng từ localStorage
 * @returns {Promise} - Promise từ fetch API
 */
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Only set default Content-Type if body is not FormData
  const defaultHeaders = options.body instanceof FormData 
    ? {} 
    : { 'Content-Type': 'application/json' };

  let config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  // Áp dụng request interceptor
  config = requestInterceptor(config);

  // Log the actual request for debugging
  if (env.NODE_ENV === 'development') {
    console.log('Actual fetch request:', {
      url,
      method: config.method,
      headers: config.headers,
      body: config.body instanceof FormData ? 'FormData object' : config.body,
    });
  }

  try {
    const response = await fetch(url, config);
    
    // Áp dụng response interceptor
    const interceptedResponse = await responseInterceptor(response);
    
    // Kiểm tra response status
    if (!interceptedResponse.ok) {
      // Thử đọc response body để lấy thông tin lỗi chi tiết
      let errorData;
      try {
        errorData = await interceptedResponse.json();
      } catch (e) {
        // Nếu không parse được JSON, sử dụng status text
        throw new Error(`API Error: ${interceptedResponse.status} ${interceptedResponse.statusText}`);
      }
      
      // Tạo error object với thông tin chi tiết
      const error = new Error(`API Error: ${interceptedResponse.status} ${interceptedResponse.statusText}`);
      error.status = interceptedResponse.status;
      error.statusText = interceptedResponse.statusText;
      error.data = errorData;
      
      // Áp dụng error interceptor
      errorInterceptor(error);
    }
    
    return await interceptedResponse.json();
  } catch (error) {
    // Áp dụng error interceptor cho lỗi không phải HTTP
    return errorInterceptor(error);
  }
};

// Các phương thức HTTP tiện ích
export const apiService = {
  get: (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => {
    // Check if data is FormData, if so, don't stringify it and remove content-type (browser will set it)
    if (data instanceof FormData) {
      const formDataOptions = { 
        ...options, 
        method: 'POST',
        body: data,
      };
      
      // Remove Content-Type header for FormData to let the browser set it with boundary
      if (formDataOptions.headers && formDataOptions.headers['Content-Type']) {
        delete formDataOptions.headers['Content-Type'];
      }
      
      return fetchApi(endpoint, formDataOptions);
    }
    
    // Regular JSON data
    return fetchApi(endpoint, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  put: (endpoint, data, options = {}) => {
    // Check if data is FormData, if so, don't stringify it and remove content-type (browser will set it)
    if (data instanceof FormData) {
      const formDataOptions = { 
        ...options, 
        method: 'PUT',
        body: data,
      };
      
      // Remove Content-Type header for FormData to let the browser set it with boundary
      if (formDataOptions.headers && formDataOptions.headers['Content-Type']) {
        delete formDataOptions.headers['Content-Type'];
      }
      
      return fetchApi(endpoint, formDataOptions);
    }
    
    // Regular JSON data
    return fetchApi(endpoint, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'DELETE' }),
};

export default apiService; 