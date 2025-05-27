import { apiService } from '../services/api';
import { USER_ENDPOINTS } from '../services/apiEndpoints';

class UserRepository {
  /**
   * Fetches active users.
   * @returns {Promise} - Promise containing the API response with active users.
   */
  async getActiveUsers() {
    try {
      const response = await apiService.get(USER_ENDPOINTS.GET_USER_ACTIVE);
      return response;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error; // Re-throw the error so it can be caught by the calling function
    }
  }

  /**
   * Fetches user information.
   * @returns {Promise} - Promise containing the API response with user information.
   */
  async getUserInformation() {
    try {
      const response = await apiService.get(USER_ENDPOINTS.GET_USER_INFORMATION);
      return response;
    } catch (error) {
      console.error('Error fetching user information:', error); 
      throw error;
    }
  }

  /**
   * Fetches all users.
   * @returns {Promise} - Promise containing the API response with all users.
   */
  async getAllUser() {
    try {
      const response = await apiService.get(USER_ENDPOINTS.GET_ALL_USER, {
        params: {
          page: 1,
          limit: 10,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  // You can add other user-related methods here in the future, e.g.:
  // async getUserById(id) { ... }
  // async updateUser(id, userData) { ... }
  // async createUser(userData) { ... }
}

export const userRepository = new UserRepository();
export default userRepository;
