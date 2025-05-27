import React, { useState, useEffect } from 'react';
import { Button, Header } from '../components/ui';
import MainLayout from '../layouts/MainLayout';
import showToast from '../utils/toast';
import { eventRepository } from '../repositories/eventRepository';
import { userRepository } from '../repositories/userRepository';
import { Link } from 'react-router-dom';

// Helper for Clock Icon (simple SVG)
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Define background colors for event categories
const categoryBackgroundColors = {
  'Corporate Event': 'bg-[#f9bc64]', // Màu cam
  'Meetup': 'bg-[#6ecadc]',          // Màu xanh dương
  'Holiday': 'bg-[#e76f51]',         // Màu đỏ cam
  'Invidiual': 'bg-[#2a9d8f]',       // Màu xanh lá
  'default': 'bg-gray-400'          // Màu mặc định
};

// Function to get the bar color based on category
const getEventBarColor = (category) => {
  return categoryBackgroundColors[category] || categoryBackgroundColors.default;
};

const Dashboard = () => {
  const [nearestEvents, setNearestEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  const [activeUsers, setActiveUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch nearest events
      try {
        setIsLoadingEvents(true);
        const eventResponse = await eventRepository.getNearestEvent();
        if (eventResponse && eventResponse.data && Array.isArray(eventResponse.data)) {
          setNearestEvents(eventResponse.data);
          setEventsError(null);
        } else {
          setNearestEvents([]);
        }
      } catch (err) {
        console.error("Error fetching nearest events:", err);
        setEventsError(err.message || 'Failed to load nearest events.');
        setNearestEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }

      // Fetch active users
      try {
        setIsLoadingUsers(true);
        const userResponse = await userRepository.getActiveUsers();
        if (userResponse && userResponse.users && Array.isArray(userResponse.users)) {
          setActiveUsers(userResponse.users);
          setUsersError(null);
        } else {
          setActiveUsers([]);
        }
      } catch (err) {
        console.error("Error fetching active users:", err);
        setUsersError(err.message || 'Failed to load active users.');
        setActiveUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatEventDateTime = (event) => {
    const dateString = event.date;
    let timeString = event.time;

    if (event.repeat_event_type === 'Daily' || event.repeat_event_type === 'Weekly' || event.repeat_event_type === 'Monthly') {
      if (event.repeat_event_time) {
        timeString = event.repeat_event_time;
      }
    }

    if (!dateString) return '';

    const eventDateInstance = new Date(dateString);
    if (timeString) {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      eventDateInstance.setHours(hours || 0, minutes || 0, seconds || 0, 0);
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const normalizedEventDate = normalizeDate(eventDateInstance);
    const normalizedToday = normalizeDate(today);
    const normalizedTomorrow = normalizeDate(tomorrow);

    let dayLabel = '';
    if (normalizedEventDate.getTime() === normalizedToday.getTime()) {
      dayLabel = 'Today';
    } else if (normalizedEventDate.getTime() === normalizedTomorrow.getTime()) {
      dayLabel = 'Tomorrow';
    } else {
      dayLabel = eventDateInstance.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    let timeLabel = '';
    if (timeString) {
      timeLabel = eventDateInstance.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    return `${dayLabel}${timeLabel ? ` | ${timeLabel}` : ''}`;
  };

  // Function to get styling for user level tags
  const getLevelTagClass = (level) => {
    switch (level.level_name?.toLowerCase()) {
      case 'Senior':
        return 'border-sky-500 text-sky-700 bg-sky-100';
      case 'Middle':
        return 'border-green-500 text-green-700 bg-green-100';
      case 'Fresher':  
        return 'border-yellow-500 text-yellow-700 bg-yellow-100';
      default:
        return 'border-gray-400 text-gray-600 bg-gray-100';
    }
  };

  return (
    <MainLayout>
      <Header title="Dashboard" />
      <div className="flex flex-col lg:flex-row gap-[20px]">
        {/* Left side (Workload - Active Users) */}
        <div className="w-full lg:w-[65%] bg-white rounded-[24px] p-[20px] shadow-sm">
          <p className="text-xl font-bold text-black mb-[20px]">
            Active Team Members
          </p>
          {isLoadingUsers && <div className="text-center text-gray-500 py-4">Loading team members...</div>}
          {usersError && <div className="text-center text-red-500 py-4">Error: {usersError}</div>}
          {!isLoadingUsers && !usersError && activeUsers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeUsers.map((user) => (
                <div key={user.id} className="bg-slate-50 hover:bg-slate-100 p-4 rounded-xl text-center shadow-sm transition-all duration-200 flex flex-col items-center">
                  <div className="relative mb-3">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'A')}&background=random&size=128`} 
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-offset-2 ring-blue-400"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800">{user.name || 'N/A'}</h3>
                  <p className="text-xs text-gray-500 mb-2">{user.position.position_name || 'N/A'}</p>
                  {user.level && (
                     <span className={`text-xs px-3 py-0.5 rounded-md border ${getLevelTagClass(user.level)}`}>
                       {user.level.level_name}
                     </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {!isLoadingUsers && !usersError && activeUsers.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No employee active
            </div>
          )}
        </div>

        {/* Right side (Nearest Events) */}
        <div className="w-full lg:w-[35%] bg-white rounded-[24px] p-[20px] shadow-sm">
          <p className="text-xl font-bold text-black mb-[20px]">
            Nearest Events
          </p>
          {isLoadingEvents && <div className="text-center text-gray-500 py-4">Loading events...</div>}
          {eventsError && <div className="text-center text-red-500 py-4">Error: {eventsError}</div>}
          {!isLoadingEvents && !eventsError && nearestEvents.length > 0 && (
            <div className="space-y-3">
              {nearestEvents.map((event) => {
                const barColorClass = getEventBarColor(event.category);
                return (
                  <div key={event.id} className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200 border border-gray-100">
                    <div className={`w-1.5 h-16 ${barColorClass} rounded-full mr-4`}></div>
                    <div className="flex-grow">
                      <h4 className="text-md font-bold text-gray-800">{event.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatEventDateTime(event)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!isLoadingEvents && !eventsError && nearestEvents.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No upcoming events found.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;