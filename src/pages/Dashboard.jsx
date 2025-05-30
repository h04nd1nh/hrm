import React, { useState, useEffect } from 'react';
import { Button, Header } from '../components/ui';
import MainLayout from '../layouts/MainLayout';
import showToast from '../utils/toast';
import { eventRepository } from '../repositories/eventRepository';
import { userRepository } from '../repositories/userRepository';
import { attendanceRepository } from '../repositories/attendanceRepository';
import { configRepository } from '../repositories/configRepository';
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
  
  const [allUserAttendance, setAllUserAttendance] = useState([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [attendanceError, setAttendanceError] = useState(null);
  
  const [positions, setPositions] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const [attendanceFilter, setAttendanceFilter] = useState('all'); // 'all', 'checked-in', 'not-checked-in', 'on-leave'

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
      
      // Fetch all user attendance
      try {
        setIsLoadingAttendance(true);
        const attendanceResponse = await attendanceRepository.getAllUserAttendance();
        if (attendanceResponse && attendanceResponse.employees && Array.isArray(attendanceResponse.employees)) {
          setAllUserAttendance(attendanceResponse.employees);
          setAttendanceError(null);
        } else {
          setAllUserAttendance([]);
        }
      } catch (err) {
        console.error("Error fetching all user attendance:", err);
        setAttendanceError(err.message || 'Failed to load attendance data.');
        setAllUserAttendance([]);
      } finally {
        setIsLoadingAttendance(false);
      }
      
      // Fetch positions and levels for reference
      try {
        setIsLoadingConfig(true);
        const [positionsResponse, levelsResponse] = await Promise.all([
          configRepository.getAllPositions(),
          configRepository.getAllLevels()
        ]);
        
        if (positionsResponse && (positionsResponse.data || positionsResponse.positions)) {
          setPositions(positionsResponse.data || positionsResponse.positions || []);
        }
        
        if (levelsResponse && levelsResponse.data) {
          setLevels(levelsResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching positions and levels:", err);
      } finally {
        setIsLoadingConfig(false);
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
  
  // Function to format time from a time string
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (error) {
      return timeString;
    }
  };

  // Helper function to get position name by ID
  const getPositionName = (positionId) => {
    if (!positionId) return 'N/A';
    const position = positions.find(pos => pos.id === positionId);
    return position ? position.position_name : 'Unknown Position';
  };
  
  // Helper function to get level name by ID
  const getLevelName = (levelId) => {
    if (!levelId) return 'N/A';
    const level = levels.find(lvl => lvl.id === levelId);
    return level ? level.level_name : 'Unknown Level';
  };

  // Filter employees based on attendance filter
  const filteredEmployees = () => {
    if (attendanceFilter === 'all') {
      return allUserAttendance;
    } else if (attendanceFilter === 'checked-in') {
      return allUserAttendance.filter(emp => emp.attendance);
    } else if (attendanceFilter === 'not-checked-in') {
      return allUserAttendance.filter(emp => !emp.attendance && !emp.leave);
    } else if (attendanceFilter === 'on-leave') {
      return allUserAttendance.filter(emp => emp.leave);
    }
    return allUserAttendance;
  };
  
  // Count employees in each category
  const getEmployeeCounts = () => {
    const total = allUserAttendance.length;
    const checkedIn = allUserAttendance.filter(emp => emp.attendance).length;
    const onLeave = allUserAttendance.filter(emp => emp.leave).length;
    const notCheckedIn = allUserAttendance.filter(emp => !emp.attendance && !emp.leave).length;
    
    return { total, checkedIn, onLeave, notCheckedIn };
  };

  return (
    <MainLayout>
      <Header title="Dashboard" />
      <div className="flex flex-col lg:flex-row gap-[20px] mb-[20px]">
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
                  <p className="text-xs text-gray-500 mb-2">{user.position?.position_name || 'N/A'}</p>
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
      
      {/* Attendance Table Section */}
      <div className="bg-white rounded-[24px] p-[20px] shadow-sm mb-[20px]">
        <p className="text-xl font-bold text-black mb-[20px]">
          Today's Attendance Status
        </p>
        
        {/* Attendance Statistics */}
        {!isLoadingAttendance && !attendanceError && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`bg-slate-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-slate-100 transition-colors ${attendanceFilter === 'all' ? 'ring-2 ring-indigo-400' : ''}`} 
                 onClick={() => setAttendanceFilter('all')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-800">{getEmployeeCounts().total}</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className={`bg-slate-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-slate-100 transition-colors ${attendanceFilter === 'checked-in' ? 'ring-2 ring-green-400' : ''}`}
                 onClick={() => setAttendanceFilter('checked-in')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Checked In</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getEmployeeCounts().checkedIn}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {getEmployeeCounts().total > 0 
                  ? `${((getEmployeeCounts().checkedIn / getEmployeeCounts().total) * 100).toFixed(1)}% of total`
                  : '0% of total'
                }
              </p>
            </div>
            
            <div className={`bg-slate-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-slate-100 transition-colors ${attendanceFilter === 'not-checked-in' ? 'ring-2 ring-red-400' : ''}`}
                 onClick={() => setAttendanceFilter('not-checked-in')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Not Checked In</p>
                  <p className="text-2xl font-bold text-red-600">
                    {getEmployeeCounts().notCheckedIn}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {getEmployeeCounts().total > 0 
                  ? `${((getEmployeeCounts().notCheckedIn / getEmployeeCounts().total) * 100).toFixed(1)}% of total`
                  : '0% of total'
                }
              </p>
            </div>
            
            <div className={`bg-slate-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-slate-100 transition-colors ${attendanceFilter === 'on-leave' ? 'ring-2 ring-purple-400' : ''}`}
                 onClick={() => setAttendanceFilter('on-leave')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">On Leave</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {getEmployeeCounts().onLeave}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {getEmployeeCounts().total > 0 
                  ? `${((getEmployeeCounts().onLeave / getEmployeeCounts().total) * 100).toFixed(1)}% of total`
                  : '0% of total'
                }
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {attendanceFilter === 'all' ? 'Showing all employees' : 
             attendanceFilter === 'checked-in' ? 'Showing only checked-in employees' : 
             attendanceFilter === 'not-checked-in' ? 'Showing only employees who haven\'t checked in' :
             'Showing only employees on leave'}
          </div>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded text-xs font-medium ${attendanceFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setAttendanceFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded text-xs font-medium ${attendanceFilter === 'checked-in' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setAttendanceFilter('checked-in')}
            >
              Checked In
            </button>
            <button 
              className={`px-3 py-1 rounded text-xs font-medium ${attendanceFilter === 'not-checked-in' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setAttendanceFilter('not-checked-in')}
            >
              Not Checked In
            </button>
            <button 
              className={`px-3 py-1 rounded text-xs font-medium ${attendanceFilter === 'on-leave' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setAttendanceFilter('on-leave')}
            >
              On Leave
            </button>
          </div>
        </div>
        
        {isLoadingAttendance && <div className="text-center text-gray-500 py-4">Loading attendance data...</div>}
        {attendanceError && <div className="text-center text-red-500 py-4">Error: {attendanceError}</div>}
        {!isLoadingAttendance && !attendanceError && filteredEmployees().length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position/Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees().map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || 'A')}&background=random&size=128`} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">ID: {employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getPositionName(employee.position_id)}</div>
                      <div className="text-sm text-gray-500">{getLevelName(employee.level_id)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.attendance ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.attendance.status === 'On Time' 
                            ? 'bg-green-100 text-green-800' 
                            : employee.attendance.status === 'Late' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {employee.attendance.status}
                        </span>
                      ) : employee.leave ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          On Leave
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Not Checked In
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.attendance?.time_in ? formatTime(employee.attendance.time_in) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.attendance?.time_out ? formatTime(employee.attendance.time_out) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.email || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoadingAttendance && !attendanceError && filteredEmployees().length === 0 && (
          <div className="text-center text-gray-500 py-8">
            {attendanceFilter === 'all' 
              ? 'No attendance data available for today.' 
              : attendanceFilter === 'checked-in' 
                ? 'No employees have checked in today.' 
                : attendanceFilter === 'not-checked-in'
                  ? 'All employees have either checked in or are on leave today.'
                  : 'No employees are on leave today.'
            }
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;