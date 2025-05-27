import React, { useState, useEffect } from 'react';
import { Button, Input, Dropdown } from '../ui';
import { userRepository } from '../../repositories/userRepository';
import { configRepository } from '../../repositories/configRepository';
import { toast } from 'react-toastify';
import '../../styles/scrollbar-hide.css';

const EditEmployeeModal = ({ isOpen, onClose, onSuccess, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_phone: '',
    password: '',
    position_id: '',
    level_id: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [levels, setLevels] = useState([]);
  const [changePassword, setChangePassword] = useState(false);

  // Initialize form with employee data when modal is opened
  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        mobile_phone: employee.mobile_phone || '',
        password: '',
        position_id: employee.position_id?.toString() || '',
        level_id: employee.level_id?.toString() || ''
      });
      setErrors({});
      setChangePassword(false);
      fetchPositionsAndLevels();
    }
  }, [isOpen, employee]);

  // Prevent page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const fetchPositionsAndLevels = async () => {
    try {
      // Fetch positions
      const positionsResponse = await configRepository.getAllPositions();
      if (positionsResponse && positionsResponse.data) {
        setPositions(positionsResponse.data);
      }

      // Fetch levels
      const levelsResponse = await configRepository.getAllLevels();
      if (levelsResponse && levelsResponse.data) {
        setLevels(levelsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching positions and levels:', error);
      toast.error('Failed to load positions and levels');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Mobile phone validation
    if (!formData.mobile_phone) {
      newErrors.mobile_phone = 'Phone number is required';
    }
    
    // Password validation (only if changing password)
    if (changePassword && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (changePassword && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Position validation
    if (!formData.position_id) {
      newErrors.position_id = 'Position is required';
    }
    
    // Level validation
    if (!formData.level_id) {
      newErrors.level_id = 'Level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleToggleChangePassword = () => {
    setChangePassword(!changePassword);
    if (!changePassword) {
      setFormData({
        ...formData,
        password: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare data for update (only include password if changing it)
      const updateData = {
        name: formData.name,
        email: formData.email,
        mobile_phone: formData.mobile_phone,
        position_id: formData.position_id,
        level_id: formData.level_id,
      };
      
      // Only include password if changing it
      if (changePassword && formData.password) {
        updateData.password = formData.password;
      }
      
      // Call API to update user
      await userRepository.updateEmployee(employee.id, updateData);
      
      toast.success('Employee updated successfully');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      // Handle specific error messages from the backend
      if (err.data && err.data.message) {
        toast.error(err.data.message);
      } else {
        toast.error('Failed to update employee: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employee || !employee.id) return;
    
    if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      return;
    }
    
    try {
      setLoading(true);
      await userRepository.deleteEmployee(employee.id);
      toast.success('Employee deleted successfully');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      if (err.data && err.data.message) {
        toast.error(err.data.message);
      } else {
        toast.error('Failed to delete employee: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(33, 85, 163, 0.16)' }}>
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold mb-6">Edit Employee</h2>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] pr-1 scrollbar-hide">
          <Input
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            error={errors.name}
          />
          
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
            error={errors.email}
          />
          
          <Input
            name="mobile_phone"
            label="Phone Number"
            value={formData.mobile_phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
            error={errors.mobile_phone}
          />
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="change-password"
                checked={changePassword}
                onChange={handleToggleChangePassword}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="change-password" className="ml-2 block text-sm text-gray-700">
                Change Password
              </label>
            </div>
          </div>
          
          {changePassword && (
            <Input
              type="password"
              name="password"
              label="New Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required={changePassword}
              error={errors.password}
            />
          )}
          
          {positions.length > 0 ? (
            <Dropdown
              name="position_id"
              label="Position"
              value={formData.position_id}
              onChange={handleChange}
              options={positions}
              placeholder="Select Position"
              required
              error={errors.position_id}
            />
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-400">
                Loading positions...
              </div>
            </div>
          )}
          
          {levels.length > 0 ? (
            <Dropdown
              name="level_id"
              label="Level"
              value={formData.level_id}
              onChange={handleChange}
              options={levels}
              placeholder="Select Level"
              required
              error={errors.level_id}
            />
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level <span className="text-red-500">*</span>
              </label>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-400">
                Loading levels...
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
            
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal; 