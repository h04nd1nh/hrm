/**
 * Tiện ích xử lý localStorage và sessionStorage
 */

// Prefix cho tất cả các key để tránh xung đột
const KEY_PREFIX = 'hrm_';

/**
 * Lưu dữ liệu vào localStorage
 * @param {string} key - Key để lưu trữ
 * @param {any} value - Giá trị cần lưu
 */
export const setLocalStorage = (key, value) => {
  try {
    const prefixedKey = `${KEY_PREFIX}${key}`;
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(prefixedKey, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Lấy dữ liệu từ localStorage
 * @param {string} key - Key để tìm kiếm
 * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy
 * @returns {any} - Dữ liệu đã lưu hoặc giá trị mặc định
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const prefixedKey = `${KEY_PREFIX}${key}`;
    const serializedValue = localStorage.getItem(prefixedKey);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Xóa dữ liệu từ localStorage
 * @param {string} key - Key cần xóa
 */
export const removeLocalStorage = (key) => {
  try {
    const prefixedKey = `${KEY_PREFIX}${key}`;
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Xóa tất cả dữ liệu của ứng dụng từ localStorage
 */
export const clearAppStorage = () => {
  try {
    // Chỉ xóa các key có prefix của ứng dụng
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing app storage:', error);
  }
};

// Export as default object
const storageUtils = {
  setItem: setLocalStorage,
  getItem: getLocalStorage,
  removeItem: removeLocalStorage,
  clearAppItems: clearAppStorage,
};

export default storageUtils; 