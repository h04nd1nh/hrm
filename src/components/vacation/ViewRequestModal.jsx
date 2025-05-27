import React from 'react';
import { Button } from '../ui';

const ViewRequestModal = ({ isOpen, onClose, request, onApprove, onReject }) => {
  if (!isOpen || !request) return null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Determine button visibility based on status
  const canApprove = request.status === 'Pending';
  const canReject = request.status === 'Pending' || request.status === 'Approve';
  
  // Determine status color for the badge
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approve':
        return 'bg-green-500 text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(33, 85, 163, 0.16)' }}>
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-start mb-6 pr-10">
          <div className="flex-shrink-0 mr-4">
            <img 
              src={request.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.user?.name || "User")}&background=random`} 
              alt={request.user?.name || "User"} 
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-bold">{request.request_type}</h2>
            <div className="text-gray-600">
              <p>From {request.user?.name || "Unknown User"}</p>
              <p className="text-sm">{request.user?.email || "No email"}</p>
            </div>
          </div>
          <div className="ml-4">
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full
              ${request.status === 'Approve' ? 'bg-green-500 text-white' : 
                request.status === 'Reject' ? 'bg-red-500 text-white' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {request.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">Start</h3>
            <div className="font-medium">{formatDate(request.start_day)}</div>
            <div className="text-gray-600">Time: {request.start_hour || 'N/A'}</div>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">End</h3>
            <div className="font-medium">{formatDate(request.end_day)}</div>
            <div className="text-gray-600">Time: {request.end_hour || 'N/A'}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Comment</h3>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[80px]">
            {request.comment || 'No comment provided'}
          </div>
        </div>

        {/* Request History - Optional, if available */}
        {request.history && request.history.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Request History</h3>
            <ul className="border rounded-lg divide-y">
              {request.history.map((item, index) => (
                <li key={index} className="p-3 flex justify-between">
                  <span>{item.action}</span>
                  <span className="text-gray-500 text-sm">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          {canReject && (
            <Button
              onClick={() => onReject(request.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Reject
            </Button>
          )}
          {canApprove && (
            <Button
              onClick={() => onApprove(request.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Approve
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewRequestModal; 