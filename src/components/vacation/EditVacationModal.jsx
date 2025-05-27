import React, { useState, useEffect } from 'react';
import { Button, Select, Input } from '../ui';
import '../../styles/scrollbar-hide.css';

const EditVacationModal = ({ isOpen, onClose, onSave, onDelete, vacation }) => {
  const [vacationData, setVacationData] = useState({
    request_type: 'Vacation',
    start_day: '',
    end_day: '',
    start_hour: '',
    end_hour: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});

  // Load vacation data when editing
  useEffect(() => {
    if (isOpen && vacation) {
      setVacationData({
        id: vacation.id,
        request_type: vacation.request_type || 'Vacation',
        start_day: vacation.start_day || '',
        end_day: vacation.end_day || '',
        start_hour: vacation.start_hour || '',
        end_hour: vacation.end_hour || '',
        comment: vacation.comment || ''
      });
      setErrors({});
    }
  }, [isOpen, vacation]);

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

  const requestTypes = ['Vacation', 'Sick Leave', 'Work Remotely'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVacationData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!vacationData.request_type) {
      newErrors.request_type = 'Request type is required';
    }
    
    if (!vacationData.start_day) {
      newErrors.start_day = 'Start day is required';
    }
    
    if (!vacationData.end_day) {
      newErrors.end_day = 'End day is required';
    }
    
    if (!vacationData.start_hour) {
      newErrors.start_hour = 'Start hour is required';
    }
    
    if (!vacationData.end_hour) {
      newErrors.end_hour = 'End hour is required';
    }
    
    if (!vacationData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    }
    
    // Check if end date is after start date
    if (vacationData.start_day && vacationData.end_day) {
      if (new Date(vacationData.end_day) < new Date(vacationData.start_day)) {
        newErrors.end_day = 'End day must be after start day';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Make sure the ID is properly included
    if (vacation && vacation.id && !vacationData.id) {
      vacationData.id = vacation.id;
    }
    
    onSave(vacationData);
  };

  const handleDelete = () => {
    if (vacation && vacation.id) {
      onDelete(vacation.id);
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
        
        <h2 className="text-xl font-bold mb-6">Edit Vacation Request</h2>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] pr-1 scrollbar-hide">
          <Select
            name="request_type"
            label="Request Type"
            value={vacationData.request_type}
            onChange={handleChange}
            options={requestTypes}
            required
            error={errors.request_type}
          />
          
          <div className="flex gap-4">
            <Input
              type="date"
              name="start_day"
              label="Start Date"
              value={vacationData.start_day}
              onChange={handleChange}
              required
              className="flex-1"
              error={errors.start_day}
            />
            
            <Input
              type="date"
              name="end_day"
              label="End Date"
              value={vacationData.end_day}
              onChange={handleChange}
              required
              className="flex-1"
              error={errors.end_day}
            />
          </div>
          
          <div className="flex gap-4">
            <Input
              type="time"
              name="start_hour"
              label="Start Time"
              value={vacationData.start_hour}
              onChange={handleChange}
              required
              className="flex-1"
              error={errors.start_hour}
            />
            
            <Input
              type="time"
              name="end_hour"
              label="End Time"
              value={vacationData.end_hour}
              onChange={handleChange}
              required
              className="flex-1"
              error={errors.end_hour}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
              <span className="text-red-600 ml-1">*</span>
            </label>
            <textarea
              name="comment"
              value={vacationData.comment}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 min-h-[100px]
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                ${errors.comment ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Add some details about your request"
              required
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Delete
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVacationModal; 