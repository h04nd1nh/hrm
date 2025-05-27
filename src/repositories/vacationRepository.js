import { apiService } from '../services/api';
import { VACATION_ENDPOINT } from '../services/apiEndpoints';

class VacationRepository {
  /**
   * Fetches all vacation requests.
   * @returns {Promise} - Promise containing the API response with vacation requests.
   */
  async getAllVacation() {
    try {
      const response = await apiService.get(VACATION_ENDPOINT.GET_ALL_VACATION);
      return response;
    } catch (error) {
      console.error('Error fetching vacations:', error);
      throw error;
    }
  }

  /**
   * Creates a new vacation request.
   * @param {Object} vacationData - The vacation data to create.
   * @param {string} vacationData.request_type - Type of request (Vacation, Sick Leave, Work Remotely).
   * @param {string} vacationData.start_day - Start date of vacation (YYYY-MM-DD).
   * @param {string} vacationData.end_day - End date of vacation (YYYY-MM-DD).
   * @param {string} vacationData.start_hour - Start time of vacation (HH:MM).
   * @param {string} vacationData.end_hour - End time of vacation (HH:MM).
   * @param {string} [vacationData.comment] - Optional comment for the request.
   * @returns {Promise} - Promise containing the API response.
   */
  async createVacation(vacationData) {
    try {
      const response = await apiService.post(VACATION_ENDPOINT.CREATE_VACATION, vacationData);
      return response;
    } catch (error) {
      console.error('Error creating vacation:', error);
      throw error;
    }
  }

  /**
   * Updates an existing vacation request.
   * @param {number|string} id - The ID of the vacation to update.
   * @param {Object} vacationData - The updated vacation data.
   * @returns {Promise} - Promise containing the API response.
   */
  async updateVacation(id, vacationData) {
    try {
      if (!id) {
        throw new Error("Vacation ID is required");
      }
      const response = await apiService.put(VACATION_ENDPOINT.UPDATE_VACATION(id), vacationData);
      return response;
    } catch (error) {
      console.error('Error updating vacation:', error);
      throw error;
    }
  }

  /**
   * Deletes a vacation request.
   * @param {number|string} id - The ID of the vacation to delete.
   * @returns {Promise} - Promise containing the API response.
   */
  async deleteVacation(id) {
    try {
      if (!id) {
        throw new Error("Vacation ID is required");
      }
      const response = await apiService.delete(VACATION_ENDPOINT.DELETE_VACATION(id));
      return response;
    } catch (error) {
      console.error('Error deleting vacation:', error);
      throw error;
    }
  }

  /**
   * Fetches all vacation requests (admin only).
   * @returns {Promise} - Promise containing the API response with all vacation requests.
   */
  async getAllRequestsAdmin() {
    try {
      const response = await apiService.get(VACATION_ENDPOINT.GET_ALL_REQUEST_ADMIN);
      return response;
    } catch (error) {
      console.error('Error fetching all requests (admin):', error);
      throw error;
    }
  }

  /**
   * Approves a vacation request (admin only).
   * @param {number|string} id - The ID of the vacation request to approve.
   * @returns {Promise} - Promise containing the API response.
   */
  async approveRequest(id) {
    try {
      if (!id) {
        throw new Error("Vacation ID is required");
      }
      const response = await apiService.put(VACATION_ENDPOINT.APPROVE_REQUEST(id));
      return response;
    } catch (error) {
      console.error('Error approving vacation request:', error);
      throw error;
    }
  }

  /**
   * Rejects a vacation request (admin only).
   * @param {number|string} id - The ID of the vacation request to reject.
   * @returns {Promise} - Promise containing the API response.
   */
  async rejectRequest(id) {
    try {
      if (!id) {
        throw new Error("Vacation ID is required");
      }
      const response = await apiService.put(VACATION_ENDPOINT.REJECT_REQUEST(id));
      return response;
    } catch (error) {
      console.error('Error rejecting vacation request:', error);
      throw error;
    }
  }
}

export const vacationRepository = new VacationRepository();
export default vacationRepository; 