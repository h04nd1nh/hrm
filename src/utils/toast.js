/**
 * Toast utility để hiển thị thông báo
 * Sử dụng thư viện toastify hoặc tương tự
 */
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Cấu hình mặc định cho toast
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

export const showToast = {
  /**
   * Hiển thị thông báo thành công
   * @param {string} message - Nội dung thông báo
   * @param {Object} options - Tùy chọn cấu hình
   */
  success: (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  /**
   * Hiển thị thông báo lỗi
   * @param {string} message - Nội dung thông báo
   * @param {Object} options - Tùy chọn cấu hình
   */
  error: (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  /**
   * Hiển thị thông báo cảnh báo
   * @param {string} message - Nội dung thông báo
   * @param {Object} options - Tùy chọn cấu hình
   */
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  /**
   * Hiển thị thông báo thông tin
   * @param {string} message - Nội dung thông báo
   * @param {Object} options - Tùy chọn cấu hình
   */
  info: (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  }
};

export default showToast; 