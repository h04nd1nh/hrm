/**
 * Các hàm tiện ích định dạng dữ liệu
 */
import env from '../config/env';

/**
 * Định dạng số dạng tiền tệ
 * @param {number} amount - Số tiền cần định dạng
 * @param {string} currency - Mã tiền tệ (mặc định từ biến môi trường)
 * @param {string} locale - Locale cho định dạng (mặc định từ biến môi trường)
 * @returns {string} - Chuỗi đã định dạng
 */
export const formatCurrency = (amount, currency = env.DEFAULT_CURRENCY, locale = env.DEFAULT_LOCALE) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Định dạng ngày tháng
 * @param {Date|string|number} date - Đối tượng Date, chuỗi ISO hoặc timestamp
 * @param {string} format - 'short', 'medium', 'long', 'full' (mặc định: 'medium')
 * @param {string} locale - Locale cho định dạng (mặc định từ biến môi trường)
 * @returns {string} - Chuỗi ngày đã định dạng
 */
export const formatDate = (date, format = 'medium', locale = env.DEFAULT_LOCALE) => {
  if (!date) return '';
  
  // Chuyển đổi đầu vào thành đối tượng Date
  const dateObject = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
  
  if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
    console.error('Invalid date format:', date);
    return '';
  }
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    long: { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' },
  };
  
  return new Intl.DateTimeFormat(locale, options[format] || options.medium).format(dateObject);
};

/**
 * Tạo chuỗi initials từ tên đầy đủ
 * @param {string} fullName - Tên đầy đủ
 * @param {number} maxLength - Số ký tự tối đa (mặc định: 2)
 * @returns {string} - Chuỗi initials
 */
export const getInitials = (fullName, maxLength = 2) => {
  if (!fullName) return '';
  
  return fullName
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part[0].toUpperCase())
    .slice(0, maxLength)
    .join('');
};

/**
 * Rút gọn văn bản và thêm dấu ... nếu quá dài
 * @param {string} text - Văn bản cần rút gọn
 * @param {number} maxLength - Độ dài tối đa (mặc định: 100)
 * @returns {string} - Văn bản đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength) + '...';
};

// Export dưới dạng default object
const formatters = {
  currency: formatCurrency,
  date: formatDate,
  initials: getInitials,
  truncate: truncateText,
};

export default formatters; 