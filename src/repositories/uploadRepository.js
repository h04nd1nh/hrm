import { apiService } from '../services/api';
import { UPLOAD_ENDPOINTS } from '../services/apiEndpoints';

class UploadRepository {
  /**
   * Uploads an image file.
   * @param {File} imageFile - The image file to upload.
   * @returns {Promise} - Promise containing the API response.
   * 
   * Expected response format:
   * {
   *   "status": "success",
   *   "message": "Image uploaded successfully",
   *   "data": {
   *     "url": "https://example.com/image.jpg"
   *   }
   * }
   */
  async uploadImage(imageFile) {
    try {
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Using post with FormData will automatically set the correct Content-Type header
      // Our apiService is already configured to handle FormData properly
      const response = await apiService.post(UPLOAD_ENDPOINTS.UPLOAD_FILE, formData);
      
      // Return the complete response as is
      return response;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export const uploadRepository = new UploadRepository();
export default uploadRepository; 