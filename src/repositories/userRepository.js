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

  /**
   * Updates user information.
   * @param {Object} userData - The user data to update.
   * @param {string} [userData.name] - User's full name.
   * @param {string} [userData.address] - User's address.
   * @param {string} [userData.birthday] - User's birthday.
   * @param {string} [userData.email] - User's email.
   * @param {string} [userData.mobile_phone] - User's mobile phone.
   * @param {string} [userData.avatar] - User's avatar URL.
   * @returns {Promise} - Promise containing the API response.
   */
  async updateUser(userData) {
    try {
      // The backend requires at least one parameter to be present
      if (!userData.name && !userData.address && !userData.birthday && !userData.email && 
          !userData.mobile_phone && !userData.avatar) {
        throw new Error("Required at least one parameter to update");
      }
      
      const response = await apiService.post(USER_ENDPOINTS.UPDATE_USER, userData);
      return response;
    } catch (error) {
      console.error('Error updating user information:', error);
      throw error;
    }
  }

  /**
   * Creates a new user.
   * @param {Object} userData - The user data to create.
   * @param {string} userData.name - User's full name.
   * @param {string} userData.email - User's email.
   * @param {string} userData.mobile_phone - User's mobile phone.
   * @param {string} userData.password - User's password.
   * @param {number|string} userData.position_id - User's position ID.
   * @param {number|string} userData.level_id - User's level ID.
   * @returns {Promise} - Promise containing the API response.
   */
  async createUser(userData) {
    try {
      // Validate required fields based on the backend requirements
      if (!userData.name || !userData.email || !userData.mobile_phone || 
          !userData.password || !userData.position_id || !userData.level_id) {
        throw new Error("All fields are required");
      }
      
      const response = await apiService.post(USER_ENDPOINTS.CREATE_USER, userData);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Updates an existing employee.
   * @param {number|string} id - The ID of the employee to update.
   * @param {Object} userData - The employee data to update.
   * @param {string} [userData.name] - Employee's name.
   * @param {string} [userData.email] - Employee's email.
   * @param {string} [userData.mobile_phone] - Employee's mobile phone.
   * @param {string} [userData.password] - Employee's new password (optional).
   * @param {number|string} [userData.position_id] - Employee's position ID.
   * @param {number|string} [userData.level_id] - Employee's level ID.
   * @returns {Promise} - Promise containing the API response.
   */
  async updateEmployee(id, userData) {
    try {
      if (!id) {
        throw new Error("Employee ID is required");
      }
      
      const response = await apiService.put(USER_ENDPOINTS.UPDATE_EMPLOYEE(id), userData);
      return response;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  /**
   * Deletes an employee.
   * @param {number|string} id - The ID of the employee to delete.
   * @returns {Promise} - Promise containing the API response.
   */
  async deleteEmployee(id) {
    try {
      if (!id) {
        throw new Error("Employee ID is required");
      }
      
      const response = await apiService.delete(USER_ENDPOINTS.DELETE_EMPLOYEE(id));
      return response;
    } catch (error) {
      console.error('Error deleting employee:', error);
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
