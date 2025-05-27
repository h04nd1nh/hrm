import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button, Header, Input } from '../components/ui';
import { userRepository } from '../repositories/userRepository';
import { uploadRepository } from '../repositories/uploadRepository';
import { toast } from 'react-toastify';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_phone: '',
    address: '',
    birthday: '',
    avatar: '',
  });
  
  const fileInputRef = useRef(null);

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await userRepository.getUserInformation();
        
        // Example response structure:
        // {
        //   "message": "Lấy thông tin user thành công",
        //   "user": {
        //     "id": 1,
        //     "position_id": null,
        //     "level_id": null,
        //     "email": "admin@gmail.com",
        //     "mobile_phone": null,
        //     "name": "Admin",
        //     "address": null,
        //     "image": null,
        //     "avatar": null,
        //     "birthday": null,
        //     "password": "$2b$08$g2j3YBNuY21IdLRe/O4XJuegndz5SQe1rs8sxgp5hRw8TfZ86gctS",
        //     "role": "Admin",
        //     "created_at": null,
        //     "updated_at": null,
        //     "createdAt": "2025-05-16T22:57:57.780Z",
        //     "updatedAt": "2025-05-16T22:57:57.780Z"
        //   }
        // }
        
        if (response && response.user) {
          setUserInfo(response.user);
          setFormData({
            name: response.user.name || '',
            email: response.user.email || '',
            mobile_phone: response.user.mobile_phone || '',
            address: response.user.address || '',
            birthday: response.user.birthday ? new Date(response.user.birthday).toISOString().split('T')[0] : '',
            avatar: response.user.avatar || '',
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user information:', err);
        setError('Could not fetch user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle image upload
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle image file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    try {
      setUploading(true);
      const response = await uploadRepository.uploadImage(file);
      
      // Handle nested response structure
      // Expected response format:
      // {
      //   "status": "success",
      //   "message": "Image uploaded successfully",
      //   "data": {
      //     "url": "https://example.com/image.jpg"
      //   }
      // }
      
      if (response && response.status === "success" && response.data && response.data.url) {
        const imageUrl = response.data.url;
        
        setFormData({
          ...formData,
          avatar: imageUrl
        });
        
        // If we're not in edit mode, update the avatar immediately
        if (!editMode) {
          await userRepository.updateUser({
            avatar: imageUrl
          });
          
          // Update the userInfo state
          setUserInfo({
            ...userInfo,
            avatar: imageUrl
          });
          
          toast.success('Profile picture updated successfully');
        }
      } else {
        toast.error('Failed to upload image: Invalid response format');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      // At least one field needs to be filled
      const hasChanges = 
        formData.name !== userInfo.name ||
        formData.address || 
        formData.birthday || 
        formData.mobile_phone || 
        formData.avatar;
      
      if (!hasChanges) {
        toast.error('Please update at least one field');
        return;
      }
      
      // Prepare data for update
      const updateData = {
        name: formData.name,
        address: formData.address,
        birthday: formData.birthday,
        mobile_phone: formData.mobile_phone,
        avatar: formData.avatar
      };
      
      // Email is typically not updated this way, but adding it if needed
      if (formData.email !== userInfo.email) {
        updateData.email = formData.email;
      }
      
      // Call the API to update user information
      setLoading(true);
      await userRepository.updateUser(updateData);
      
      // Refresh user data
      const refreshResponse = await userRepository.getUserInformation();
      if (refreshResponse && refreshResponse.user) {
        setUserInfo(refreshResponse.user);
      }
      
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Get user profile image
  const getUserProfileImage = () => {
    // Use formData.avatar in edit mode to show the potentially new avatar
    if (editMode && formData.avatar) return formData.avatar;
    
    if (!userInfo) return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsjemrQJ1aY8GXzDH7zyW2PeSr0NoRlUL0Q&s";
    
    return userInfo.avatar || userInfo.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsjemrQJ1aY8GXzDH7zyW2PeSr0NoRlUL0Q&s";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <MainLayout>
      <Header title="Profile" />
      
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Profile Image */}
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              <div className="relative">
                <img 
                  src={getUserProfileImage()} 
                  alt={userInfo?.name || 'User'} 
                  className={`w-40 h-40 rounded-full object-cover border-4 border-blue-100 ${uploading ? 'opacity-50' : ''}`}
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
                <div className="absolute bottom-0 right-0">
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center p-0 shadow-lg transition-colors duration-200"
                    onClick={handleImageClick}
                    disabled={uploading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold mt-4">{userInfo?.name}</h2>
              
            </div>

            {/* Profile Information */}
            <div className="md:w-2/3 md:pl-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <Button 
                  variant={editMode ? "success" : "primary"}
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={uploading || loading}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  {editMode ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-gray-800">{userInfo?.name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  {editMode ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      disabled={true} // Email is typically not changed this way
                    />
                  ) : (
                    <p className="text-gray-800">{userInfo?.email || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  {editMode ? (
                    <Input
                      name="mobile_phone"
                      value={formData.mobile_phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-800">{userInfo?.mobile_phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Birthday</label>
                  {editMode ? (
                    <Input
                      name="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-800">{userInfo?.birthday ? formatDate(userInfo.birthday) : 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Role</label>
                  <p className="text-gray-800">{userInfo?.role || 'Employee'}</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Member Since</label>
                  <p className="text-gray-800">{userInfo?.createdAt ? formatDate(userInfo.createdAt) : 'Not available'}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  {editMode ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-800">{userInfo?.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Position and Level information */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Position</label>
                    <p className="text-gray-800">
                      {userInfo?.position.position_name ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          {userInfo.position.position_name}
                        </span>
                      ) : (
                        'Not assigned'
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Level</label>
                    <p className="text-gray-800">
                      {userInfo?.level.level_name ? (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {userInfo.level.level_name}
                        </span>
                      ) : (
                        'Not assigned'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;