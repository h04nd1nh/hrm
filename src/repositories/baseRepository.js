/**
 * Base Repository
 * Cung cấp các phương thức CRUD cơ bản
 * có thể được kế thừa bởi các repository khác
 */

import { apiService } from '../services/api';

export default class BaseRepository {
  /**
   * Constructor
   * @param {Object} endpoints - Các endpoint của entity
   */
  constructor(endpoints) {
    this.endpoints = endpoints;
  }

  /**
   * Lấy danh sách tất cả bản ghi
   * @param {Object} params - Các tham số truy vấn (phân trang, sắp xếp, lọc)
   * @returns {Promise} - Promise chứa danh sách bản ghi
   */
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = params ? `${this.endpoints.GET_ALL}?${queryParams}` : this.endpoints.GET_ALL;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết của một bản ghi
   * @param {string|number} id - ID của bản ghi
   * @returns {Promise} - Promise chứa thông tin bản ghi
   */
  async getById(id) {
    try {
      const response = await apiService.get(this.endpoints.GET_BY_ID(id));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo bản ghi mới
   * @param {Object} data - Dữ liệu bản ghi mới
   * @returns {Promise} - Promise chứa thông tin bản ghi đã tạo
   */
  async create(data) {
    try {
      const response = await apiService.post(this.endpoints.CREATE, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin bản ghi
   * @param {string|number} id - ID của bản ghi
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa thông tin bản ghi đã cập nhật
   */
  async update(id, data) {
    try {
      const response = await apiService.put(this.endpoints.UPDATE(id), data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa bản ghi
   * @param {string|number} id - ID của bản ghi
   * @returns {Promise} - Promise kết quả xóa
   */
  async delete(id) {
    try {
      const response = await apiService.delete(this.endpoints.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo query params từ object
   * @param {Object} params - Object chứa các params
   * @returns {string} - Chuỗi query params
   */
  buildQueryParams(params = {}) {
    return new URLSearchParams(params).toString();
  }

  /**
   * Tạo đường dẫn endpoint với query params
   * @param {string} endpoint - Endpoint cơ bản
   * @param {Object} params - Object chứa các params 
   * @returns {string} - Endpoint hoàn chỉnh với query params
   */
  buildEndpointWithParams(endpoint, params = {}) {
    const queryParams = this.buildQueryParams(params);
    return queryParams ? `${endpoint}?${queryParams}` : endpoint;
  }
} 