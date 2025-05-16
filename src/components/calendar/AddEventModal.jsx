import React, { useState, useEffect } from 'react';
import { Button, Select, Input, Toggle } from '../ui';
import '../../styles/scrollbar-hide.css';

const AddEventModal = ({ isOpen, onClose, onSave, onDelete, event }) => {
  const [eventData, setEventData] = useState({
    name: '',
    category: 'Corporate Event',
    priority: 'Medium',
    date: '',
    time: '',
    description: '',
    repeat_event_type: '',
    repeat_event_day: '',
    repeat_event_time: '',
  });

  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatType, setRepeatType] = useState('Daily');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [repeatEveryDay, setRepeatEveryDay] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Load event data when editing
  useEffect(() => {
    console.log("isOpen:", isOpen , "event:", event);
    if (isOpen && event) {
      console.log("Modal opened with event data:", event);
      
      // Đặt isEditMode trước để đảm bảo trạng thái chỉnh sửa được thiết lập đúng
      setIsEditMode(true);
      
      setEventData({
        id: event.id,
        name: event.name || '',
        category: event.category || 'Corporate Event',
        priority: event.priority || 'Medium',
        date: event.date || '',
        time: event.time || '',
        description: event.description || '',
        repeat_event_type: event.repeat_event_type || '',
        repeat_event_day: event.repeat_event_day || '',
        repeat_event_time: event.repeat_event_time || '',
      });
      
      // Cập nhật trạng thái lặp lại
      if (event.repeat_event_type && event.repeat_event_type !== 'None') {
        setIsRepeat(true);
        setRepeatType(event.repeat_event_type);
        
        if (event.repeat_event_day === 'everyday') {
          setRepeatEveryDay(true);
        } else if (event.repeat_event_day) {
          setSelectedDay(event.repeat_event_day);
          setRepeatEveryDay(false);
        }
      } else {
        setIsRepeat(false);
      }
      
      // Đặt lại lỗi
      setErrors({});
    } else if (isOpen && !event) {
      // Đặt lại form khi thêm sự kiện mới
      setEventData({
        name: '',
        category: 'Corporate Event',
        priority: 'Medium',
        date: '',
        time: '',
        description: '',
        repeat_event_type: '',
        repeat_event_day: '',
        repeat_event_time: '',
      });
      
      setIsRepeat(false);
      setRepeatType('Daily');
      setSelectedDay('Monday');
      setRepeatEveryDay(false);
      setIsEditMode(false);
      setErrors({});
    }
  }, [isOpen, event]);

  // Ngăn cuộn trang khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const categories = ['Corporate Event', 'Meetup', 'Holiday', 'Invidiual'];
  const priorities = ['Low', 'Medium', 'High'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`);
    setEventData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log("Updated event data:", newData);
      return newData;
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDay(day);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.name.trim()) {
      newErrors.name = 'Event name is required';
    }
    
    if (!eventData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!eventData.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    if (!eventData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const finalEventData = {
      ...eventData
    };
    
    if (isRepeat) {
      finalEventData.repeat_event_type = repeatType;
      finalEventData.repeat_event_day = repeatEveryDay ? 'everyday' : selectedDay;
      
      // Make sure repeat_event_time is set when repeat is enabled
      if (!finalEventData.repeat_event_time) {
        finalEventData.repeat_event_time = finalEventData.time || '09:00';
      }
    } else {
      // Set repeat_event_type to 'None' when repeat is disabled
      finalEventData.repeat_event_type = 'None';
      finalEventData.repeat_event_day = '';
      finalEventData.repeat_event_time = '';
    }
    
    onSave(finalEventData);
  };

  if (!isOpen) return null;

  console.log("Rendering form with data:", eventData, "isEditMode:", isEditMode);
  
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
        
        <h2 className="text-xl font-bold mb-6">{isEditMode ? 'Edit Event' : 'Add Event'}</h2>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] pr-1 scrollbar-hide">
          <Input
            name="name"
            label="Event Name"
            value={eventData.name}
            onChange={handleChange}
            placeholder="Katy's Birthday"
            required
            error={errors.name}
          />
          
          <Select
            name="category"
            label="Event Category"
            value={eventData.category}
            onChange={handleChange}
            options={categories}
            required
            error={errors.category}
          />
          
          <Select
            name="priority"
            label="Priority"
            value={eventData.priority}
            onChange={handleChange}
            options={priorities}
            required
            error={errors.priority}
          />
          
          <div className="flex gap-4">
            <Input
              type="date"
              name="date"
              label="Date"
              value={eventData.date}
              onChange={handleChange}
              required
              className="flex-1"
            />
            
            <Input
              type="time"
              name="time"
              label="Time"
              value={eventData.time}
              onChange={handleChange}
              required
              className="flex-1"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-red-600 ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 min-h-[100px]
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Add some description of the event"
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <Toggle
              label="Repeat Event"
              checked={isRepeat}
              onChange={() => setIsRepeat(!isRepeat)}
              className="mb-4"
            />
            
            {isRepeat && (
              <>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Complete this task</label>
                  <div className="flex gap-2">
                    {['Daily', 'Weekly', 'Monthly'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setRepeatType(type)}
                        className={`py-2 px-4 rounded text-sm ${
                          repeatType === type ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {!repeatEveryDay && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">On this day</label>
                    <div className="flex gap-2 flex-wrap">
                      {weekDays.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`w-10 h-10 rounded-full text-sm flex items-center justify-center ${
                            selectedDay === day ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <Toggle
                  id="repeat-every-day"
                  label="Repeat every day"
                  checked={repeatEveryDay}
                  onChange={() => setRepeatEveryDay(!repeatEveryDay)}
                  className="mb-4"
                />
                
                <Input
                  type="time"
                  name="repeat_event_time"
                  label="Time"
                  value={eventData.repeat_event_time}
                  onChange={handleChange}
                />
              </>
            )}
          </div>
          
          <div className={`flex ${isEditMode ? 'justify-between' : 'justify-end'}`}>
            {isEditMode && (
              <Button
                type="button"
                onClick={() => {
                  if (onDelete && event && event.id) {
                    onDelete(event.id);
                    onClose();
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Delete Event
              </Button>
            )}
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {isEditMode ? 'Update' : 'Save Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal; 