/**
 * Cấu hình biến môi trường
 * File này giúp quản lý việc truy xuất biến môi trường một cách thống nhất
 */

// Các giá trị mặc định nếu biến môi trường không tồn tại
const defaults = {
  API_BASE_URL: 'http://localhost:8000/api',
  API_VERSION: 'v1',
  STORAGE_KEY_PREFIX: 'hrm_',
  DEFAULT_LOCALE: 'vi-VN',
  DEFAULT_CURRENCY: 'VND',
};

/**
 * Lấy giá trị biến môi trường với fallback
 * @param {string} key - Tên biến môi trường (không bao gồm tiền tố VITE_)
 * @param {any} defaultValue - Giá trị mặc định nếu biến không tồn tại
 * @returns {string} - Giá trị biến môi trường
 */
function getEnv(key, defaultValue) {
  const fullKey = `VITE_${key}`;
  const value = import.meta.env[fullKey];
  
  if (value !== undefined) {
    return value;
  }
  
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  
  return defaults[key];
}

// Các biến môi trường ứng dụng
export const env = {
  API_BASE_URL: getEnv('API_BASE_URL'),
  API_VERSION: getEnv('API_VERSION'),
  STORAGE_KEY_PREFIX: getEnv('STORAGE_KEY_PREFIX'),
  DEFAULT_LOCALE: getEnv('DEFAULT_LOCALE'),
  DEFAULT_CURRENCY: getEnv('DEFAULT_CURRENCY'),
};

export default env; 