import React, { useState, useEffect } from 'react';
import Notification from '../../assets/notifications.svg';
import Right from '../../assets/right.svg';
import { attendanceRepository } from '../../repositories/attendanceRepository';
import { userRepository } from '../../repositories/userRepository';
import { notificationRepository } from '../../repositories/notificationRepository';
import { UserOnly } from '../index';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workedTime, setWorkedTime] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();

  // Function to fetch today's attendance status
  const fetchAttendanceStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceRepository.getTodayAttendanceStatus();
      setAttendanceStatus(response.attendance);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance status:', err);
      setError('Không thể lấy thông tin điểm danh');
      setLoading(false);
    }
  };

  // Function to fetch user information
  const fetchUserInfo = async () => {
    try {
      setUserLoading(true);
      const response = await userRepository.getUserInformation();
      setUserInfo(response.user);
      setUserLoading(false);
    } catch (err) {
      console.error('Error fetching user information:', err);
      setUserLoading(false);
    }
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await notificationRepository.getAllNotifications();
      
      if (response && response.notifications) {
        setNotifications(response.notifications);
        
        // Count unread notifications
        const unreadNotifications = response.notifications.filter(
          notification => !notification.is_read
        );
        setUnreadCount(unreadNotifications.length);
      }
      
      setNotificationsLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotificationsLoading(false);
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationRepository.readAllNotifications();
      
      // Update local state to mark all as read
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification,
          is_read: true
        }))
      );
      
      setUnreadCount(0);
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      toast.error('Không thể đánh dấu thông báo là đã đọc');
    }
  };

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    
    // Fetch notifications when opening the dropdown
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  // Handle check in
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await attendanceRepository.checkIn();
      toast.success('Check in thành công');
      await fetchAttendanceStatus();
    } catch (err) {
      console.error('Error during check in:', err);
      setError('Không thể check in');
      setLoading(false);
    }
  };

  // Handle check out
  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await attendanceRepository.checkOut();
      toast.success('Check out thành công');
      await fetchAttendanceStatus();
    } catch (err) {
      console.error('Error during check out:', err);
      setError('Không thể check out');
      setLoading(false);
    }
  };
  
  // Handle profile click
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  // Handle logout click
  const handleLogoutClick = () => {
    // Implement logout functionality here
    // Clear local storage, cookies, etc.
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/auth/signin');
    toast.success('Đăng xuất thành công');
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date for notifications
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for notifications
  const formatNotificationTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHour / 24);
    
    // Same day (hours or minutes ago)
    if (diffDays < 1) {
      if (diffHour >= 1) {
        return `${diffHour}h ago`;
      } else if (diffMin >= 1) {
        return `${diffMin}m ago`;
      } else {
        return 'Just now';
      }
    }
    
    // Yesterday or Today
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays < 7) {
      // Within last week
      return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      // More than a week ago
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
  };

  // Fetch attendance status and user info on component mount
  useEffect(() => {
    fetchAttendanceStatus();
    fetchUserInfo();
    fetchNotifications(); // Fetch notifications on load
  }, []);

  // Update worked time every second if checked in but not checked out
  useEffect(() => {
    let interval = null;
    
    if (attendanceStatus && attendanceStatus.time_in && !attendanceStatus.time_out) {
      // Calculate initial worked time
      const calculateWorkedTime = () => {
        try {
          // Parse the time_in value (format: "08:13:32")
          const [hours, minutes, seconds] = attendanceStatus.time_in.split(':').map(Number);
          
          // Create today's date
          const now = new Date();
          const timeIn = new Date(now.toDateString());
          
          // Set the hours, minutes, seconds from time_in
          timeIn.setHours(hours, minutes, seconds);
          
          // Calculate difference in seconds
          const diffInSeconds = Math.floor((now.getTime() - timeIn.getTime()) / 1000);
          setWorkedTime(diffInSeconds > 0 ? diffInSeconds : 0);
        } catch (err) {
          console.error('Error calculating work time:', err);
          setWorkedTime(0);
        }
      };
      
      // Initial calculation
      calculateWorkedTime();
      
      // Set up interval for continuous updates
      interval = setInterval(calculateWorkedTime, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [attendanceStatus]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationContainer = document.getElementById('notification-container');
      if (notificationContainer && !notificationContainer.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render attendance UI based on status
  const renderAttendanceUI = () => {
    if (loading) {
      return <div className="px-4 py-2 bg-gray-100 rounded-md">Đang tải...</div>;
    }
    
    if (error) {
      return <div className="px-4 py-2 bg-red-100 text-red-600 rounded-md">{error}</div>;
    }
    
    if (!attendanceStatus || !attendanceStatus.time_in) {
      return (
        <button 
          onClick={handleCheckIn}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Check In
        </button>
      );
    }
    
    if (attendanceStatus.time_in && !attendanceStatus.time_out) {
      return (
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md">
            Đã làm: {formatTime(workedTime)}
          </div>
          <button 
            onClick={handleCheckOut}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            Check Out
          </button>
        </div>
      );
    }
    
    if (attendanceStatus.time_in && attendanceStatus.time_out) {
      try {
        // Parse time_in and time_out (format: "08:13:32" and "17:30:45")
        const [inHours, inMinutes, inSeconds] = attendanceStatus.time_in.split(':').map(Number);
        const [outHours, outMinutes, outSeconds] = attendanceStatus.time_out.split(':').map(Number);
        
        // Calculate total seconds worked
        const totalSeconds = 
          (outHours * 3600 + outMinutes * 60 + outSeconds) - 
          (inHours * 3600 + inMinutes * 60 + inSeconds);
        
        return (
          <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            Đã checkout: {formatTime(totalSeconds > 0 ? totalSeconds : 0)}
          </div>
        );
      } catch (err) {
        console.error('Error calculating checkout time:', err);
        return (
          <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            Đã checkout
          </div>
        );
      }
    }
    
    return null;
  };
  
  // Get user profile image (check both avatar and image fields)
  const getUserProfileImage = () => {
    if (!userInfo) return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsjemrQJ1aY8GXzDH7zyW2PeSr0NoRlUL0Q&s";
    
    return userInfo.avatar || userInfo.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsjemrQJ1aY8GXzDH7zyW2PeSr0NoRlUL0Q&s";
  };
  
  return (
    <div>
        <div className="flex flex-row items-center justify-between mb-[30px]">
            <h1 className="text-[36px] font-bold text-[#0A1629]">{title}</h1>
            <div className="flex flex-row items-center justify-between gap-[24px]">
                <UserOnly>
                    {renderAttendanceUI()}
                </UserOnly>
                
                {/* Notification section with dropdown */}
                <div id="notification-container" className="relative">
                  <div 
                    className="p-[12px] rounded-[14px] bg-white cursor-pointer relative"
                    onClick={toggleNotifications}
                  >
                    <img src={Notification} alt="Notification" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 max-h-[80vh] overflow-y-auto rounded-lg shadow-xl bg-white z-50">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        <button 
                          onClick={toggleNotifications}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {notificationsLoading ? (
                        <div className="p-6 text-center text-gray-500 bg-white">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <p>Đang tải thông báo...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="bg-white">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition bg-white ${
                                !notification.is_read ? 'border-l-4 border-l-blue-500 pl-3' : ''
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3">
                                  <img 
                                    src={notification.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender?.name || "User")}&background=random`} 
                                    alt={notification.sender?.name} 
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between">
                                    <div>
                                      <span className="font-semibold text-sm">{notification.sender?.name}</span>
                                      <span className="text-sm text-gray-700"> {notification.content}</span>
                                    </div>
                                    {!notification.is_read && (
                                      <span className="h-2 w-2 bg-blue-600 rounded-full mt-2"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {unreadCount > 0 && (
                            <div className="p-3 border-t border-gray-200 bg-white">
                              <button 
                                onClick={markAllAsRead}
                                className="w-full text-sm text-blue-600 hover:text-blue-800 py-1"
                              >
                                Mark all as read
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500 bg-white">
                          <p>Không có thông báo</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="relative user-profile-container group">
                  <div 
                    className='flex flex-row items-center justify-between gap-[12px] px-[12px] py-[9px] rounded-[14px] bg-white cursor-pointer'
                  >
                      <img 
                        src={getUserProfileImage()} 
                        alt="Avatar" 
                        className="w-[30px] h-[30px] rounded-full"
                      />
                      <p className='text-[16px] font-bold text-[#0A1629]'>
                        {userLoading ? 'Loading...' : (userInfo ? userInfo.name : 'User')}
                      </p>
                      <img 
                        src={Right} 
                        alt="Right" 
                        className="w-[24px] h-[24px] transition-transform duration-200 group-hover:rotate-90"
                      />
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-xl bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Header;
