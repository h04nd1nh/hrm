import React, { useState, useEffect } from 'react';
import Notification from '../../assets/notifications.svg';
import Right from '../../assets/right.svg';
import { attendanceRepository } from '../../repositories/attendanceRepository';
import { userRepository } from '../../repositories/userRepository';
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

  // Fetch attendance status and user info on component mount
  useEffect(() => {
    fetchAttendanceStatus();
    fetchUserInfo();
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
                <img src={Notification} alt="Notification" className="p-[12px] rounded-[14px] bg-white"/>
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
