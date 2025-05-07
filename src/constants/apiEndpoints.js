/**
 * Các API endpoint của ứng dụng
 */

const API_VERSION = 'v1';
const BASE_URL = `/api/${API_VERSION}`;

// Các endpoint xác thực
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
  ME: `${BASE_URL}/auth/me`,
};

// Các endpoint cho người dùng
export const USER_ENDPOINTS = {
  ALL: `${BASE_URL}/users`,
  DETAIL: (id) => `${BASE_URL}/users/${id}`,
  CREATE: `${BASE_URL}/users`,
  UPDATE: (id) => `${BASE_URL}/users/${id}`,
  DELETE: (id) => `${BASE_URL}/users/${id}`,
  CHANGE_PASSWORD: (id) => `${BASE_URL}/users/${id}/change-password`,
  PROFILE: `${BASE_URL}/users/profile`,
};

// Các endpoint cho nhân viên
export const EMPLOYEE_ENDPOINTS = {
  ALL: `${BASE_URL}/employees`,
  DETAIL: (id) => `${BASE_URL}/employees/${id}`,
  CREATE: `${BASE_URL}/employees`,
  UPDATE: (id) => `${BASE_URL}/employees/${id}`,
  DELETE: (id) => `${BASE_URL}/employees/${id}`,
  DEPARTMENTS: (id) => `${BASE_URL}/employees/${id}/departments`,
};

// Các endpoint cho phòng ban
export const DEPARTMENT_ENDPOINTS = {
  ALL: `${BASE_URL}/departments`,
  DETAIL: (id) => `${BASE_URL}/departments/${id}`,
  CREATE: `${BASE_URL}/departments`,
  UPDATE: (id) => `${BASE_URL}/departments/${id}`,
  DELETE: (id) => `${BASE_URL}/departments/${id}`,
  EMPLOYEES: (id) => `${BASE_URL}/departments/${id}/employees`,
};

// Các endpoint cho chấm công
export const ATTENDANCE_ENDPOINTS = {
  ALL: `${BASE_URL}/attendances`,
  DETAIL: (id) => `${BASE_URL}/attendances/${id}`,
  CREATE: `${BASE_URL}/attendances`,
  UPDATE: (id) => `${BASE_URL}/attendances/${id}`,
  DELETE: (id) => `${BASE_URL}/attendances/${id}`,
  BY_EMPLOYEE: (employeeId) => `${BASE_URL}/attendances/employee/${employeeId}`,
  CHECK_IN: `${BASE_URL}/attendances/check-in`,
  CHECK_OUT: `${BASE_URL}/attendances/check-out`,
};

// Gộp tất cả endpoint
const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  EMPLOYEE: EMPLOYEE_ENDPOINTS,
  DEPARTMENT: DEPARTMENT_ENDPOINTS,
  ATTENDANCE: ATTENDANCE_ENDPOINTS,
};

export default API_ENDPOINTS; 