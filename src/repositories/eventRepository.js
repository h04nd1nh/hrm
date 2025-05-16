/**
 * Event Repository
 * Chứa các phương thức tương tác với API event trong lịch
 */

import { apiService } from '../services/api';
import { CALENDAR_ENDPOINTS } from '../services/apiEndpoints';
import BaseRepository from './baseRepository';

class EventRepository extends BaseRepository {
  constructor() {
    super(CALENDAR_ENDPOINTS);
  }

  /**
   * Lấy tất cả sự kiện trong tháng
   * @param {number} month - Tháng (1-12)
   * @param {number} year - Năm
   * @returns {Promise} - Promise chứa danh sách sự kiện
   */
  async getEventsInMonth(month, year) {
    try {
      const params = {
        month,
        year,
      };
      
      const endpoint = this.buildEndpointWithParams(
        CALENDAR_ENDPOINTS.GET_ALL_EVENT_IN_MONTH,
        params
      );
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách sự kiện
   * @param {number} page - Số trang (mặc định là 1)
   * @param {number} limit - Số lượng sự kiện trên một trang (mặc định là 10)
   * @param {string} name - Tên sự kiện để tìm kiếm (tùy chọn)
   * @returns {Promise} - Promise chứa danh sách sự kiện
   */
  async getEventsList(page = 1, limit = 10, name = '') {
    try {
      const params = {
        page,
        limit
      };
      
      // Thêm tham số name nếu có
      if (name) {
        params.name = name;
      }
      
      const endpoint = this.buildEndpointWithParams(
        CALENDAR_ENDPOINTS.GET_ALL_EVENT_LISTL,
        params
      );
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Tạo sự kiện mới
   * @param {Object} eventData - Dữ liệu sự kiện
   * @returns {Promise} - Promise chứa thông tin sự kiện đã tạo
   */
  async createEvent(eventData) {
    try {
      const response = await apiService.post(CALENDAR_ENDPOINTS.GET_ALL_EVENT_IN_MONTH, eventData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin sự kiện
   * @param {string|number} id - ID của sự kiện
   * @param {Object} eventData - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa thông tin sự kiện đã cập nhật
   */
  async updateEvent(id, eventData) {
    try {
      const endpoint = CALENDAR_ENDPOINTS.UPDATE_EVENT(id);
      const response = await apiService.put(endpoint, eventData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa sự kiện
   * @param {string|number} id - ID của sự kiện
   * @returns {Promise} - Promise kết quả xóa
   */
  async deleteEvent(id) {
    try {
      const endpoint = `${CALENDAR_ENDPOINTS.GET_ALL_EVENT_IN_MONTH}/${id}`;
      const response = await apiService.delete(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Xuất instance của repository
export const eventRepository = new EventRepository();
export default eventRepository;
