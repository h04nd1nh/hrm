import { apiService } from '../services/api';
import { UPLOAD_ENDPOINTS } from '../services/apiEndpoints';

class UploadRepository {
  /**
   * Uploads an image file.
   * @param {File} imageFile - The image file to upload.
   * @returns {Promise} - Promise containing the API response.
   */
  async uploadImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile); // Key is 'image'

      // apiService.post should ideally handle FormData and set Content-Type to multipart/form-data automatically.
      // If not, you might need to pass custom headers: { 'Content-Type': 'multipart/form-data' }
      // For most modern HTTP clients (like axios, fetch), this is handled if you pass FormData as the body.
      const response = await apiService.post(UPLOAD_ENDPOINTS.UPLOAD_FILE, formData, {
        headers: {
          // Explicitly setting Content-Type might be needed if your apiService doesn't do it automatically for FormData.
          // However, often it's better to let the browser/client set it as it will include the boundary.
          // 'Content-Type': 'multipart/form-data', 
        }
      });
      return response;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export const uploadRepository = new UploadRepository();
export default uploadRepository; 