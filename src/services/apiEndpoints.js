/**
 * File khai báo tất cả các endpoints API trong ứng dụng
 * Tương tự như cách khai báo trong Dio (Flutter)
 */

// Auth endpoints
export const AUTH_ENDPOINTS = {
  SIGN_IN: '/auth/signin',
};

export const CALENDAR_ENDPOINTS = {
    GET_ALL_EVENT_IN_MONTH: '/event',
    GET_ALL_EVENT_LISTL: '/event-admin',
    CREATE_EVENT: '/event',
    UPDATE_EVENT: (id) => `/event/${id}`,
    DELETE_EVENT: (id) => `/event/${id}`,
}

export const UPLOAD_ENDPOINTS = {
    UPLOAD_FILE: '/upload/image',
}

// Có thể thêm các endpoint khác tùy vào yêu cầu của dự án 