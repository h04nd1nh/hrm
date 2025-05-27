import React, { useState, useEffect } from 'react';
import { Button, Input } from '../ui';
import '../../styles/scrollbar-hide.css';

const AddLevelModal = ({ isOpen, onClose, onSave }) => {
  const [levelData, setLevelData] = useState({
    level_name: '',
  });
  const [errors, setErrors] = useState({});

  // Prevent scrolling when modal is open
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setLevelData({
        level_name: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLevelData(prev => ({
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
    
    if (!levelData.level_name.trim()) {
      newErrors.level_name = 'Level name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(levelData);
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
        
        <h2 className="text-xl font-bold mb-6">Add New Level</h2>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] pr-1 scrollbar-hide">
          <Input
            name="level_name"
            label="Level Name"
            value={levelData.level_name}
            onChange={handleChange}
            placeholder="Senior, Junior, etc."
            required
            error={errors.level_name}
          />
          
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 mr-2 px-6 py-2 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save Level
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLevelModal; 