import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button, Header, Input } from '../components/ui';
import eventRepository from '../repositories/eventRepository';
import AddEventModal from '../components/calendar/AddEventModal';
import { showToast } from '../utils/toast';
import '../styles/scrollbar-hide.css';
import { AdminOnly } from '../components';
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [listEvents, setListEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  });

  // Định nghĩa màu cho từng loại category
  const categoryColors = {
    'Corporate Event': 'border-[#f9bc64]', // Màu cam
    'Meetup': 'border-[#6ecadc]',          // Màu xanh dương
    'Holiday': 'border-[#e76f51]',         // Màu đỏ cam
    'Invidiual': 'border-[#2a9d8f]',       // Màu xanh lá
    // Màu mặc định nếu không tìm thấy category
    'default': 'border-gray-400'
  };

  // Hàm lấy màu border dựa vào category
  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  // Get current month's details
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Get previous month's details
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

  // Calculate number of rows needed for this month's calendar
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
  const totalDaysDisplayed = firstDay + daysInMonth;
  const numberOfRows = Math.ceil(totalDaysDisplayed / 7);

  // Create dynamic grid-rows template based on number of rows
  const gridRowsTemplate = useMemo(() => {
    return `auto repeat(${numberOfRows}, 1fr)`;
  }, [numberOfRows]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Fetch events for the current month
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Month is 0-indexed in JS Date, but our API expects 1-12
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const response = await eventRepository.getEventsInMonth(month, year);
        // Cập nhật để xử lý cấu trúc dữ liệu mới
        if (response && response.data) {
          setEvents(response.data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
        // Kết thúc hiệu ứng chuyển tháng
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const navigateMonth = (direction) => {
    // Bắt đầu hiệu ứng chuyển tháng
    setIsTransitioning(true);

    // Tạo một timeout nhỏ để đảm bảo hiệu ứng được áp dụng trước khi thay đổi tháng
    setTimeout(() => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + direction);
      setCurrentDate(newDate);
    }, 10);
  };

  // Hàm lấy sự kiện cho ngày cụ thể
  const getEventsForDay = (day) => {
    // Tạo chuỗi ngày theo định dạng YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;

    // Tìm sự kiện cho ngày này
    const dayData = events.find(item => item.date === dateString);
    // Trả về mảng events nếu có, nếu không trả về mảng rỗng
    return dayData && dayData.events ? dayData.events : [];
  };

  // Xử lý thêm sự kiện mới hoặc cập nhật sự kiện
  const handleSaveEvent = async (eventData) => {
    try {
      setLoading(true);

      let response;
      if (eventData.id) {
        // Update existing event
        response = await eventRepository.updateEvent(eventData.id, eventData);
        showToast.success('Event updated successfully!');
      } else {
        // Create new event
        response = await eventRepository.createEvent(eventData);
        showToast.success('Event created successfully!');
      }

      // Đóng modal
      setIsAddEventModalOpen(false);
      setSelectedEvent(null);

      // Tải lại dữ liệu sự kiện dựa vào chế độ xem hiện tại
      if (viewMode === 'calendar') {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const response = await eventRepository.getEventsInMonth(month, year);

        if (response && response.data) {
          setEvents(response.data);
        }
      } else {
        fetchEventsList(pagination.currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      showToast.error(eventData.id ? 'Failed to update event. Please try again.' : 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events for the list view
  const fetchEventsList = async (page = 1, name = searchTerm) => {
    try {
      setListLoading(true);
      const response = await eventRepository.getEventsList(page, 10, name);
      if (response && response.data) {
        setListEvents(response.data);
        // Set pagination if available in response
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setListEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events list:', error);
      setListEvents([]);
      showToast.error('Failed to load events list');
    } finally {
      setListLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchEventsList(1, searchTerm);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchEventsList(page, searchTerm);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'list') {
      fetchEventsList(1, ''); // Reset to first page and clear search when switching to list view
      setSearchTerm('');
    }
  };

  // Format date for display in list
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle event click (xem chi tiết sự kiện)
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsAddEventModalOpen(true);
  };

  // Handle event delete
  const handleEventDelete = async (eventId) => {
    try {
      setLoading(true);
      await eventRepository.deleteEvent(eventId);

      // Refresh data based on current view
      if (viewMode === 'calendar') {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const response = await eventRepository.getEventsInMonth(month, year);

        if (response && response.data) {
          setEvents(response.data);
        }
      } else {
        fetchEventsList(pagination.currentPage, searchTerm);
      }

      showToast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast.error('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDays = () => {
    const days = [];

    // Add day names (Mon, Tue, etc.)
    dayNames.forEach((day, index) => {
      days.push(
        <div key={`header-${index}`} className="bg-white py-1.5 text-center font-bold text-gray-600 h-8">
          {day}
        </div>
      );
    });

    // Calculate the first day offset (0 = Monday, 6 = Sunday in our display)
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

    // Add days from previous month
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
      days.push(
        <div key={`prev-${i}`} className="bg-gray-50 p-2 relative flex flex-col h-full">
          <div className="absolute top-1 right-1 text-gray-400">{prevMonthDay}</div>
        </div>
      );
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      // Lấy sự kiện cho ngày này
      const dayEvents = getEventsForDay(day);

      days.push(
        <div key={`day-${day}`} className="bg-white p-2 relative flex flex-col h-full">
          <div className="absolute top-1 right-1 text-gray-500">{day}</div>
          <div className="mt-5 flex-grow overflow-y-auto max-h-[120px] scrollbar-hide">
            {dayEvents.map((event, index) => {
              const borderColor = getCategoryColor(event.category);
              const textColor = borderColor.replace('border-', 'text-');

              return (
                <div
                  key={`event-${day}-${event.id || index}`}
                  className={`mb-1 p-1.5 rounded relative pl-3 bg-blue-50 border-l-4 ${borderColor}`}
                >
                  <div className="text-xs font-medium mb-0.5">{event.name}</div>
                  <div className="text-xs text-gray-500">{event.time}</div>
                  <div className={`inline-block w-3 h-3 absolute right-1 bottom-1 ${textColor}`}>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Add days from next month (only if needed)
    const totalDaysDisplayed = firstDay + daysInMonth;
    let daysFromNextMonth = 7 - (totalDaysDisplayed % 7);

    // If daysFromNextMonth is 7, it means we don't need to add any days
    if (daysFromNextMonth === 7) {
      daysFromNextMonth = 0;
    }

    // Add only enough days to complete the current rows, not a full extra row
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push(
        <div key={`next-${i}`} className="bg-gray-50 p-2 relative flex flex-col h-full">
          <div className="absolute top-1 right-1 text-gray-400">{i}</div>
        </div>
      );
    }

    return days;
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <Header title="Calendar" />

        <div className="flex flex-col justify-end h-full">
          <div className="flex justify-between mb-2">
            <AdminOnly children={<div className="flex space-x-2">
              <Button
                variant={viewMode === 'calendar' ? 'primary' : 'light'}
                onClick={() => handleViewModeChange('calendar')}
                className={viewMode === 'calendar' ? '' : 'text-gray-600'}
              >
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'light'}
                onClick={() => handleViewModeChange('list')}
                className={viewMode === 'list' ? '' : 'text-gray-600'}
              >
                List
              </Button>
            </div>} />
            <AdminOnly children={<Button onClick={() => setIsAddEventModalOpen(true)}>
              <i className="fa-solid fa-plus mr-2"></i>
              Add Event
            </Button>} />


          </div>

          {viewMode === 'calendar' && (
            <div className="bg-[#FFFFFF] rounded-lg flex flex-col flex-grow overflow-hidden mb-6">
              <div className="flex justify-between items-center p-2">
                <Button
                  variant="text"
                  onClick={() => navigateMonth(-1)}
                  className="text-blue-500 text-lg p-0"
                  disabled={loading || isTransitioning}
                >
                  ←
                </Button>
                <h2 className="text-lg font-bold">
                  {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="text"
                  onClick={() => navigateMonth(1)}
                  className="text-blue-500 text-lg p-0"
                  disabled={loading || isTransitioning}
                >
                  →
                </Button>
              </div>

              <div
                className={`grid grid-cols-7 gap-px bg-[#E6EBF5] border border-[#E6EBF5] flex-grow auto-cols-fr transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'} relative`}
                style={{ gridTemplateRows: gridRowsTemplate }}
              >
                {renderDays()}

                {loading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="bg-[#FFFFFF] rounded-lg flex flex-col flex-grow overflow-hidden mb-6 p-4 pb-8">
              <h2 className="text-lg font-bold mb-4">Events List</h2>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="text"
                  placeholder="Search events by name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  className="ml-2 px-6 mb-4"
                  variant="primary"
                  disabled={listLoading}
                >
                  Search
                </Button>
                {searchTerm && (
                  <Button
                    type="button"
                    variant="light"
                    className="ml-2 border border-gray-300 mb-4"
                    onClick={() => {
                      setSearchTerm('');
                      fetchEventsList(1, '');
                    }}
                    disabled={listLoading}
                  >
                    Clear
                  </Button>
                )}
              </form>

              {listLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="flex flex-col" style={{ height: 'calc(100% - 100px)' }}>
                  <div className="overflow-y-auto max-h-[calc(100%-80px)] scrollbar-hide">
                    {listEvents.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Event
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Priority
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {listEvents.map((event) => (
                            <tr
                              key={event.id}
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleEventClick(event)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{event.name}</div>
                                <div className="text-sm text-gray-500">{event.description.substring(0, 50)}{event.description.length > 50 ? '...' : ''}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(event.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {event.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.category === 'Corporate Event' ? 'bg-yellow-100 text-yellow-800' :
                                  event.category === 'Meetup' ? 'bg-blue-100 text-blue-800' :
                                    event.category === 'Holiday' ? 'bg-red-100 text-red-800' :
                                      'bg-green-100 text-green-800'
                                  }`}>
                                  {event.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.priority === 'High' ? 'bg-red-100 text-red-800' :
                                  event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                  {event.priority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        {searchTerm ? `No events found matching "${searchTerm}"` : 'No events found'}
                      </div>
                    )}
                  </div>

                  {/* Pagination - Always show if there are events */}
                  {listEvents.length > 0 && (
                    <div className="py-3 flex items-center justify-between border-t border-gray-200 mt-4 mb-4 sticky bottom-0 bg-white">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <Button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          variant="light"
                          className={pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          variant="light"
                          className={pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Next
                        </Button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{' '}
                            <span className="font-medium">
                              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                            </span> of{' '}
                            <span className="font-medium">{pagination.totalItems}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => handlePageChange(pagination.currentPage - 1)}
                              disabled={pagination.currentPage === 1}
                              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                              <span className="sr-only">Previous</span>
                              &larr;
                            </button>

                            {/* Page numbers */}
                            {[...Array(pagination.totalPages).keys()].map((page) => (
                              <button
                                key={page + 1}
                                onClick={() => handlePageChange(page + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                  ${pagination.currentPage === page + 1
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                              >
                                {page + 1}
                              </button>
                            ))}

                            <button
                              onClick={() => handlePageChange(pagination.currentPage + 1)}
                              disabled={pagination.currentPage === pagination.totalPages}
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                              <span className="sr-only">Next</span>
                              &rarr;
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={() => {
            setIsAddEventModalOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={handleEventDelete}
          event={selectedEvent}
        />
      </div>
    </MainLayout>
  );
};

export default Calendar;