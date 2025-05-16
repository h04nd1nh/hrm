/**
 * Auth Repository
 * Chứa các phương thức tương tác với API authentication
 */

import { apiService } from '../services/api';
import { AUTH_ENDPOINTS } from '../services/apiEndpoints';

class AuthRepository {
  /**
   * Đăng nhập
   * @param {Object} credentials - Thông tin đăng nhập (email, password)
   * @returns {Promise} - Promise chứa thông tin đăng nhập
   */
  async signIn(credentials) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.SIGN_IN, credentials);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - Thông tin người dùng
   * @returns {Promise} - Promise chứa thông tin đăng ký
   */
  async signUp(userData) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.SIGN_UP, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }


  /**
   * Làm mới token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - Promise chứa token mới
   */
  async refreshToken(refreshToken) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gửi yêu cầu quên mật khẩu
   * @param {Object} data - Dữ liệu yêu cầu (email)
   * @returns {Promise} - Promise kết quả yêu cầu
   */
  async forgotPassword(data) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đặt lại mật khẩu
   * @param {Object} data - Dữ liệu đặt lại mật khẩu (token, newPassword)
   * @returns {Promise} - Promise kết quả đặt lại mật khẩu
   */
  async resetPassword(data) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Xuất instance của repository
export const authRepository = new AuthRepository();
export default authRepository; 