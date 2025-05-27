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
    GET_NEAREST_EVENT: '/event-nearest',
    CREATE_EVENT: '/event',
    UPDATE_EVENT: (id) => `/event/${id}`,
    DELETE_EVENT: (id) => `/event/${id}`,
}

export const UPLOAD_ENDPOINTS = {
    UPLOAD_FILE: '/upload/image',
}

export const USER_ENDPOINTS = {
    GET_USER_ACTIVE: '/user-active',
    GET_USER_INFORMATION: '/user-information',
    GET_ALL_USER: '/user',
    UPDATE_USER: '/user/update',
    CREATE_USER: '/user',
    UPDATE_EMPLOYEE: (id) => `/user/update-admin/${id}`,
    DELETE_EMPLOYEE: (id) => `/user/${id}`,
}

export const ATTENDANCE_ENDPOINTS = {
    GET_ATTENDANCE_LIST: '/attendance/get_attendance',
    CHECK_IN: '/attendance/checkin',
    CHECK_OUT: '/attendance/checkout',
    GET_ATTENDANCE_TODAY_STATUS: '/attendance/get_today_attendance_status',
    GET_ATTENDANCE_BY_ID: (id) => `/attendance/get_attendance/${id}`,
}

export const CONFIG_ENDPOINTS = {
    VIEW_ALL_LEVEL: '/level',
    VIEW_ALL_POSITION: '/position',
    ADD_LEVEL: '/level',
    ADD_POSITION: '/position',
    UPDATE_LEVEL: (id) => `/level/${id}`,
    UPDATE_POSITION: (id) => `/position/${id}`,
    DELETE_LEVEL: (id) => `/level/${id}`,
    DELETE_POSITION: (id) => `/position/${id}`,
}


// Có thể thêm các endpoint khác tùy vào yêu cầu của dự án 