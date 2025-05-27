import { apiService } from '../services/api';
import { NOTIFICATION_ENDPOINT } from '../services/apiEndpoints';

class NotificationRepository {
  /**
   * Fetches all notifications for the current user.
   * @returns {Promise} - Promise containing the API response with notifications.
   */
  async getAllNotifications() {
    try {
      const response = await apiService.get(NOTIFICATION_ENDPOINT.GET_ALL_NOTIFICATION);
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Marks all notifications as read.
   * @returns {Promise} - Promise containing the API response.
   */
  async readAllNotifications() {
    try {
      const response = await apiService.put(NOTIFICATION_ENDPOINT.READ_ALL_NOTIFICATION);
      return response;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }
}

export const notificationRepository = new NotificationRepository();
export default notificationRepository; 