import { apiService } from '../services/api';
import { ATTENDANCE_ENDPOINTS } from '../services/apiEndpoints';

class AttendanceRepository {
  /**
   * Fetches attendance list.
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise containing the API response with attendance data.
   */
  async getAttendanceList(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = queryParams 
        ? `${ATTENDANCE_ENDPOINTS.GET_ATTENDANCE_LIST}?${queryParams}` 
        : ATTENDANCE_ENDPOINTS.GET_ATTENDANCE_LIST;
        
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching attendance list:', error);
      throw error;
    }
  }

  /**
   * Fetches attendance by ID.
   * @param {string|number} id - The ID of the attendance record to fetch
   * @returns {Promise} - Promise containing the API response with attendance data.
   */
  async getAttendanceById(id) {
    try {
      const response = await apiService.get(ATTENDANCE_ENDPOINTS.GET_ATTENDANCE_BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Error fetching attendance with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Records check-in for the current user.
   * @param {Object} data - Check-in data (may include location, notes, etc.)
   * @returns {Promise} - Promise containing the API response of check-in status.
   */
  async checkIn(data = {}) {
    try {
      const response = await apiService.post(ATTENDANCE_ENDPOINTS.CHECK_IN, data);
      return response;
    } catch (error) {
      console.error('Error during check-in:', error);
      throw error;
    }
  }

  /**
   * Records check-out for the current user.
   * @param {Object} data - Check-out data (may include location, notes, etc.)
   * @returns {Promise} - Promise containing the API response of check-out status.
   */
  async checkOut(data = {}) {
    try {
      const response = await apiService.post(ATTENDANCE_ENDPOINTS.CHECK_OUT, data);
      return response;
    } catch (error) {
      console.error('Error during check-out:', error);
      throw error;
    }
  }

  /**
   * Gets today's attendance status for the current user.
   * @returns {Promise} - Promise containing the API response with today's attendance status.
   */
  async getTodayAttendanceStatus() {
    try {
      const response = await apiService.get(ATTENDANCE_ENDPOINTS.GET_ATTENDANCE_TODAY_STATUS);
      return response;
    } catch (error) {
      console.error('Error fetching today\'s attendance status:', error);
      throw error;
    }
  }

  async getAllUserAttendance() {
    try {
      const response = await apiService.get(ATTENDANCE_ENDPOINTS.GET_ATTENDACE_ALL_USER);
      return response;
    } catch (error) {
      console.error('Error fetching all user attendance:', error);
      throw error;
    }
  }
  

}

export const attendanceRepository = new AttendanceRepository();
export default attendanceRepository; 