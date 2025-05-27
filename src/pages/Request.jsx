import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button, Header } from '../components/ui';
import { vacationRepository } from '../repositories/vacationRepository';
import { showToast } from '../utils/toast';
import AdminOnly from '../components/auth/AdminOnly';
import ViewRequestModal from '../components/vacation/ViewRequestModal';

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const response = await vacationRepository.getAllRequestsAdmin();
      
      if (response && response.vacations) {
        setRequests(response.vacations);
      }
      setError(null);
    } catch (err) {
      setError("Error fetching vacation requests: " + (err.message || "Unknown error"));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const response = await vacationRepository.approveRequest(id);
      
      if (response && response.message) {
        showToast.success(response.message);
      } else {
        showToast.success('Request Approve successfully');
      }
      
      // Refresh the request list
      fetchAllRequests();
      // Close modal if it was opened
      if (showViewModal) {
        setShowViewModal(false);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      showToast.error(error.message || 'Failed to approve request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      const response = await vacationRepository.rejectRequest(id);
      
      if (response && response.message) {
        showToast.success(response.message);
      } else {
        showToast.success('Request Reject successfully');
      }
      
      // Refresh the request list
      fetchAllRequests();
      // Close modal if it was opened
      if (showViewModal) {
        setShowViewModal(false);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      showToast.error(error.message || 'Failed to reject request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to format date in a readable way
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approve':
        return 'bg-green-500 text-white';
      case 'Reject':
        return 'bg-red-500 text-white';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Check if request can be Approve (only if status is Pending)
  const canApprove = (request) => {
    return request.status === 'Pending';
  };

  // Check if request can be Reject (if status is Pending or Approve)
  const canReject = (request) => {
    return request.status === 'Pending' || request.status === 'Approve';
  };

  return (
    <MainLayout>
      <AdminOnly>
        <Header title="Vacation Requests Management" />
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">All Vacation Requests</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          ) : (
            <>
              {requests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr 
                          key={request.id} 
                          className="hover:bg-gray-50 cursor-pointer" 
                          onClick={() => handleViewRequest(request)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={
                                    request.user?.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      request.user?.name || "User"
                                    )}&background=random`
                                  }
                                  alt={request.user?.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.user?.name || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.user?.email || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.request_type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(request.start_day)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {request.start_hour}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(request.end_day)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {request.end_hour}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${request.status === 'Approve' ? 'bg-green-500 text-white' : 
                                request.status === 'Reject' ? 'bg-red-500 text-white' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {request.comment || 'No comment'}
                            </div>
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking buttons
                          >
                            <div className="flex space-x-2">
                              {canApprove(request) && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleApprove(request.id)}
                                  className="text-white bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                              )}
                              {canReject(request) && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleReject(request.id)}
                                  className="text-white bg-red-600 hover:bg-red-700"
                                >
                                  Reject
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                  No vacation requests found
                </div>
              )}
            </>
          )}
        </div>

        {/* Request Details Modal */}
        <ViewRequestModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          request={selectedRequest}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </AdminOnly>
    </MainLayout>
  );
};

export default Request;