import { useState, useEffect } from 'react';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '../utils/storage';

/**
 * Custom hook để sử dụng localStorage với React states
 * @param {string} key - Key để lưu trữ trong localStorage
 * @param {any} initialValue - Giá trị mặc định nếu không có trong localStorage
 * @returns {[any, Function, Function]} - [state, setState, removeState]
 */
const useLocalStorage = (key, initialValue) => {
  // Khởi tạo state với giá trị từ localStorage hoặc initialValue
  const [storedValue, setStoredValue] = useState(() => {
    return getLocalStorage(key, initialValue);
  });

  // Hàm để cập nhật cả state và localStorage
  const setValue = (value) => {
    // Hỗ trợ cả function và giá trị
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    
    // Cập nhật state
    setStoredValue(valueToStore);
    
    // Cập nhật localStorage
    setLocalStorage(key, valueToStore);
  };

  // Hàm để xóa khỏi localStorage và reset state về initialValue
  const removeValue = () => {
    setStoredValue(initialValue);
    removeLocalStorage(key);
  };

  // Đồng bộ khi key thay đổi
  useEffect(() => {
    setStoredValue(getLocalStorage(key, initialValue));
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage; 