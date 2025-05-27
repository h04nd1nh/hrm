import { apiService } from '../services/api';
import { CONFIG_ENDPOINTS } from '../services/apiEndpoints';

class ConfigRepository {
  /**
   * Fetches all levels.
   * @returns {Promise} - Promise containing the API response with levels.
   */
  async getAllLevels() {
    try {
      const response = await apiService.get(CONFIG_ENDPOINTS.VIEW_ALL_LEVEL);
      return response;
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  }

  /**
   * Fetches all positions.
   * @returns {Promise} - Promise containing the API response with positions.
   */
  async getAllPositions() {
    try {
      const response = await apiService.get(CONFIG_ENDPOINTS.VIEW_ALL_POSITION);
      return response;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }

  /**
   * Adds a new level.
   * @param {Object} levelData - The level data to add.
   * @returns {Promise} - Promise containing the API response.
   */
  async addLevel(levelData) {
    try {
      const response = await apiService.post(CONFIG_ENDPOINTS.ADD_LEVEL, levelData);
      return response;
    } catch (error) {
      console.error('Error adding level:', error);
      throw error;
    }
  }

  /**
   * Adds a new position.
   * @param {Object} positionData - The position data to add.
   * @returns {Promise} - Promise containing the API response.
   */
  async addPosition(positionData) {
    try {
      const response = await apiService.post(CONFIG_ENDPOINTS.ADD_POSITION, positionData);
      return response;
    } catch (error) {
      console.error('Error adding position:', error);
      throw error;
    }
  }

  /**
   * Updates an existing level.
   * @param {number} id - The ID of the level to update.
   * @param {Object} levelData - The updated level data.
   * @returns {Promise} - Promise containing the API response.
   */
  async updateLevel(id, levelData) {
    try {
      const response = await apiService.put(CONFIG_ENDPOINTS.UPDATE_LEVEL(id), levelData);
      return response;
    } catch (error) {
      console.error(`Error updating level with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Updates an existing position.
   * @param {number} id - The ID of the position to update.
   * @param {Object} positionData - The updated position data.
   * @returns {Promise} - Promise containing the API response.
   */
  async updatePosition(id, positionData) {
    try {
      const response = await apiService.put(CONFIG_ENDPOINTS.UPDATE_POSITION(id), positionData);
      return response;
    } catch (error) {
      console.error(`Error updating position with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a level.
   * @param {number} id - The ID of the level to delete.
   * @returns {Promise} - Promise containing the API response.
   */
  async deleteLevel(id) {
    try {
      const response = await apiService.delete(CONFIG_ENDPOINTS.DELETE_LEVEL(id));
      return response;
    } catch (error) {
      console.error(`Error deleting level with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a position.
   * @param {number} id - The ID of the position to delete.
   * @returns {Promise} - Promise containing the API response.
   */
  async deletePosition(id) {
    try {
      const response = await apiService.delete(CONFIG_ENDPOINTS.DELETE_POSITION(id));
      return response;
    } catch (error) {
      console.error(`Error deleting position with ID ${id}:`, error);
      throw error;
    }
  }
}

export const configRepository = new ConfigRepository();
export default configRepository; 