import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button, Header } from '../components/ui';
import AddVacationModal from '../components/vacation/AddVacationModal';
import EditVacationModal from '../components/vacation/EditVacationModal';
import { vacationRepository } from '../repositories/vacationRepository';
import { showToast } from '../utils/toast';

const Vacation = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVacations = async () => {
    try {
      setLoading(true);
      const response = await vacationRepository.getAllVacation();
      
      if (response && response.vacations) {
        setVacations(response.vacations);
      }
      setError(null);
    } catch (err) {
      setError("Error fetching vacations: " + (err.message || "Unknown error"));
      setVacations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacations();
  }, []);

  const handleAddVacation = () => {
    setShowAddModal(true);
  };

  const handleEditVacation = (vacation) => {
    if (!vacation || !vacation.id) {
      showToast.error('Cannot edit vacation: missing vacation data or ID');
      return;
    }
    
    console.log('Setting selected vacation for editing:', vacation);
    setSelectedVacation(vacation);
    setShowEditModal(true);
  };

  const handleVacationSave = async (vacationData) => {
    try {
      setLoading(true);
      const response = await vacationRepository.createVacation(vacationData);
      
      if (response && response.message) {
        showToast.success(response.message);
      } else {
        showToast.success('Vacation request created successfully');
      }
      
      // Refresh the vacation list after adding
      fetchVacations();
      
      // Close modal after saving
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving vacation request:', error);
      showToast.error(error.message || 'Failed to create vacation request. Please try again.');
      setError("Failed to create vacation request. Please try again."); 
    } finally {
      setLoading(false);
    }
  };

  const handleVacationUpdate = async (vacationData) => {
    try {
      setLoading(true);
      
      if (!vacationData.id) {
        showToast.error('Vacation ID is missing. Please try again.');
        setLoading(false);
        return;
      }
      
      const { id, ...updateData } = vacationData;
      console.log('Updating vacation with ID:', id, 'and data:', updateData);
      
      const response = await vacationRepository.updateVacation(id, updateData);
      
      if (response && response.message) {
        showToast.success(response.message);
      } else {
        showToast.success('Vacation request updated successfully');
      }
      
      // Refresh the vacation list after updating
      fetchVacations();
      
      // Close modal after saving
      setShowEditModal(false);
      setSelectedVacation(null);
    } catch (error) {
      console.error('Error updating vacation request:', error);
      showToast.error(error.message || 'Failed to update vacation request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVacationDelete = async (id) => {
    try {
      setLoading(true);
      const response = await vacationRepository.deleteVacation(id);
      
      if (response && response.message) {
        showToast.success(response.message);
      } else {
        showToast.success('Vacation request deleted successfully');
      }
      
      // Refresh the vacation list after deleting
      fetchVacations();
      
      // Close modal after deleting
      setShowEditModal(false);
      setSelectedVacation(null);
    } catch (error) {
      console.error('Error deleting vacation request:', error);
      showToast.error(error.message || 'Failed to delete vacation request. Please try again.');
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
        return 'bg-green-100 text-green-800';
      case 'Reject':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Check if vacation can be edited (only if status is Pending)
  const canEditVacation = (vacation) => {
    return vacation.status === 'Pending';
  };

  return (
    <MainLayout>
      <Header title="Vacation" />
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Vacation Requests</h2>
          <Button 
            variant="primary"
            onClick={handleAddVacation}
          >
            Request Vacation
          </Button>
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
            {vacations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                    {vacations.map((vacation) => (
                      <tr key={vacation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {vacation.request_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(vacation.start_day)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vacation.start_hour}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(vacation.end_day)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vacation.end_hour}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vacation.status)}`}>
                            {vacation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 truncate max-w-xs">
                            {vacation.comment || 'No comment'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {canEditVacation(vacation) && (
                            <Button
                              variant="text"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => handleEditVacation(vacation)}
                            >
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                No vacation requests yet
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add Vacation Modal */}
      <AddVacationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleVacationSave}
      />

      {/* Edit Vacation Modal */}
      <EditVacationModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedVacation(null); }}
        onSave={handleVacationUpdate}
        onDelete={handleVacationDelete}
        vacation={selectedVacation}
      />
    </MainLayout>
  );
};

export default Vacation;