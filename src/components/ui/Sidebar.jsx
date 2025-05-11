import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import dashboardIcon from '../../assets/dashboard.svg';
import dashboardActiveIcon from '../../assets/dashboard_active.svg';
import calendarIcon from '../../assets/calendar.svg';
import calendarActiveIcon from '../../assets/calendar_active.svg';
import vacationIcon from '../../assets/vacation.svg';
import vacationActiveIcon from '../../assets/vacation_active.svg';
import employeeIcon from '../../assets/employee.svg';
import employeeActiveIcon from '../../assets/employee_active.svg';
import messageIcon from '../../assets/message.svg';
import messageActiveIcon from '../../assets/message_active.svg';
import logoIcon from '../../assets/logo.svg';
import logoutIcon from '../../assets/logout.svg';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen p-[20px]">
      <div className=" bg-white justify-between left-0 top-0 flex flex-col p-[16px] pr-[0px] rounded-[20px] h-full">
        {/* App logo */}
        <div>
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-[40px]">
            <img src={logoIcon} alt="Logo" className="w-8 h-8" />
          </div>

          {/* Navigation items */}
          <nav className="flex flex-col gap-2">
            {/* Dashboard */}
            <Link to="/dashboard" className="flex flex-row items-stretch justify-between">
              <div className={`flex flex-row items-center justify-start p-2 rounded-lg gap-[16px] w-[175px] transition-all duration-300 ${isActive('/dashboard')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:bg-gray-100 font-semibold text-base'
              }`}>
                <img
                  src={isActive('/dashboard') ? dashboardActiveIcon : dashboardIcon}
                  alt="Dashboard"
                  className="w-6 h-6"
                />
                <span className={isActive('/dashboard') ? 'text-[#3F8CFF] font-bold' : 'text-[#7D8592] font-semibold'}>
                  Dashboard
                </span>
              </div>
              <div className={`w-1 rounded-[2px] ml-[8px] transition-all duration-300 ${isActive('/dashboard') ? 'bg-[#3F8CFF]' : 'bg-white'}`}></div>
            </Link>

            {/* Calendar */}
            <Link to="/calendar" className="flex flex-row items-stretch justify-between">
              <div className={`flex flex-row items-center justify-start p-2 rounded-lg gap-[16px] w-[175px] transition-all duration-300 ${isActive('/calendar')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:bg-gray-100 font-semibold text-base'
              }`}>
                <img
                  src={isActive('/calendar') ? calendarActiveIcon : calendarIcon}
                  alt="Calendar"
                  className="w-6 h-6"
                />
                <span className={isActive('/calendar') ? 'text-[#3F8CFF] font-bold' : 'text-[#7D8592] font-semibold'}>
                  Calendar
                </span>
              </div>
              <div className={`w-1 rounded-[2px] ml-[8px] transition-all duration-300 ${isActive('/calendar') ? 'bg-[#3F8CFF]' : 'bg-white'}`}></div>
            </Link>

            {/* Vacations */}
            <Link to="/vacation" className="flex flex-row items-stretch justify-between">
              <div className={`flex flex-row items-center justify-start p-2 rounded-lg gap-[16px] w-[175px] transition-all duration-300 ${isActive('/vacation')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:bg-gray-100 font-semibold text-base'
              }`}>
                <img
                  src={isActive('/vacation') ? vacationActiveIcon : vacationIcon}
                  alt="Vacations"
                  className="w-6 h-6"
                />
                <span className={isActive('/vacation') ? 'text-[#3F8CFF] font-bold' : 'text-[#7D8592] font-semibold'}>
                  Vacations
                </span>
              </div>
              <div className={`w-1 rounded-[2px] ml-[8px] transition-all duration-300 ${isActive('/vacation') ? 'bg-[#3F8CFF]' : 'bg-white'}`}></div>
            </Link>

            {/* Employees */}
            <Link to="/employee" className="flex flex-row items-stretch justify-between">
              <div className={`flex flex-row items-center justify-start p-2 rounded-lg gap-[16px] w-[175px] transition-all duration-300 ${isActive('/employee')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:bg-gray-100 font-semibold text-base'
              }`}>
                <img
                  src={isActive('/employee') ? employeeActiveIcon : employeeIcon}
                  alt="Employees"
                  className="w-6 h-6"
                />
                <span className={isActive('/employee') ? 'text-[#3F8CFF] font-bold' : 'text-[#7D8592] font-semibold'}>
                  Employees
                </span>
              </div>
              <div className={`w-1 rounded-[2px] ml-[8px] transition-all duration-300 ${isActive('/employee') ? 'bg-[#3F8CFF]' : 'bg-white'}`}></div>
            </Link>

            {/* Messenger */}
            <Link to="/messenger" className="flex flex-row items-stretch justify-between">
              <div className={`flex flex-row items-center justify-start p-2 rounded-lg gap-[16px] w-[175px] transition-all duration-300 ${isActive('/messenger')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:bg-gray-100 font-semibold text-base'
              }`}>
                <img
                  src={isActive('/messenger') ? messageActiveIcon : messageIcon}
                  alt="Messenger"
                  className="w-6 h-6"
                />
                <span className={isActive('/messenger') ? 'text-[#3F8CFF] font-bold' : 'text-[#7D8592] font-semibold'}>
                  Messenger
                </span>
              </div>
              <div className={`w-1 rounded-[2px] ml-[8px] transition-all duration-300 ${isActive('/messenger') ? 'bg-[#3F8CFF]' : 'bg-white'}`}></div>
            </Link>
          </nav>
        </div>

        {/* User and logout */}
        <div className="flex flex-col items-start mb-[30px]">
          <Link to="/logout" className="flex flex-row items-stretch justify-between w-full">
            <div className="flex flex-row items-center justify-start p-2 rounded-lg gap-[16px] w-[175px] text-gray-500 hover:text-gray-700 font-semibold text-base transition-all duration-300">
              <img
                src={logoutIcon}
                alt="Logout"
                className="w-6 h-6"
              />
              <span className="text-[#7D8592]">Logout</span>
            </div>
            <div className="w-1 rounded-[2px] ml-[8px] bg-white transition-all duration-300"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 