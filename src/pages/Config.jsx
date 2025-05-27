import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button, Header } from '../components/ui';
import { configRepository } from '../repositories/configRepository';
import AdminOnly from '../components/auth/AdminOnly';
import AddLevelModal from '../components/config/AddLevelModal';
import AddPositionModal from '../components/config/AddPositionModal';
import EditLevelModal from '../components/config/EditLevelModal';
import EditPositionModal from '../components/config/EditPositionModal';

const Config = () => {
  // State for levels and positions
  const [levels, setLevels] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState({
    levels: true,
    positions: true
  });
  const [error, setError] = useState({
    levels: null,
    positions: null
  });
  
  // State for modal visibility
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showEditLevelModal, setShowEditLevelModal] = useState(false);
  const [showEditPositionModal, setShowEditPositionModal] = useState(false);
  
  // State for selected items to edit
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchLevels();
    fetchPositions();
  }, []);

  // Fetch levels
  const fetchLevels = async () => {
    try {
      setLoading(prev => ({ ...prev, levels: true }));
      const response = await configRepository.getAllLevels();
      
      if (response && response.data) {
        setLevels(response.data);
      }
      setError(prev => ({ ...prev, levels: null }));
    } catch (err) {
      setError(prev => ({ ...prev, levels: 'Error fetching levels: ' + (err.message || 'Unknown error') }));
      setLevels([]);
    } finally {
      setLoading(prev => ({ ...prev, levels: false }));
    }
  };

  // Fetch positions
  const fetchPositions = async () => {
    try {
      setLoading(prev => ({ ...prev, positions: true }));
      const response = await configRepository.getAllPositions();
      
      if (response && response.data) {
        setPositions(response.data);
      } else if (response && response.positions) {
        setPositions(response.positions);
      }
      setError(prev => ({ ...prev, positions: null }));
    } catch (err) {
      setError(prev => ({ ...prev, positions: 'Error fetching positions: ' + (err.message || 'Unknown error') }));
      setPositions([]);
    } finally {
      setLoading(prev => ({ ...prev, positions: false }));
    }
  };

  // Handle adding new level
  const handleAddLevel = async (levelData) => {
    try {
      await configRepository.addLevel(levelData);
      setShowLevelModal(false);
      fetchLevels(); // Refresh levels
    } catch (err) {
      console.error('Error adding level:', err);
      alert('Failed to add level: ' + (err.message || 'Unknown error'));
    }
  };

  // Handle adding new position
  const handleAddPosition = async (positionData) => {
    try {
      await configRepository.addPosition(positionData);
      setShowPositionModal(false);
      fetchPositions(); // Refresh positions
    } catch (err) {
      console.error('Error adding position:', err);
      alert('Failed to add position: ' + (err.message || 'Unknown error'));
    }
  };
  
  // Handle updating level
  const handleUpdateLevel = async (id, levelData) => {
    try {
      await configRepository.updateLevel(id, levelData);
      setShowEditLevelModal(false);
      setSelectedLevel(null);
      fetchLevels(); // Refresh levels
    } catch (err) {
      console.error('Error updating level:', err);
      alert('Failed to update level: ' + (err.message || 'Unknown error'));
    }
  };
  
  // Handle updating position
  const handleUpdatePosition = async (id, positionData) => {
    try {
      await configRepository.updatePosition(id, positionData);
      setShowEditPositionModal(false);
      setSelectedPosition(null);
      fetchPositions(); // Refresh positions
    } catch (err) {
      console.error('Error updating position:', err);
      alert('Failed to update position: ' + (err.message || 'Unknown error'));
    }
  };
  
  // Handle deleting level
  const handleDeleteLevel = async (id) => {
    try {
      await configRepository.deleteLevel(id);
      setShowEditLevelModal(false);
      setSelectedLevel(null);
      fetchLevels(); // Refresh levels
    } catch (err) {
      console.error('Error deleting level:', err);
      alert('Failed to delete level: ' + (err.message || 'Unknown error'));
    }
  };
  
  // Handle deleting position
  const handleDeletePosition = async (id) => {
    try {
      await configRepository.deletePosition(id);
      setShowEditPositionModal(false);
      setSelectedPosition(null);
      fetchPositions(); // Refresh positions
    } catch (err) {
      console.error('Error deleting position:', err);
      alert('Failed to delete position: ' + (err.message || 'Unknown error'));
    }
  };
  
  // Handle edit level click
  const handleEditLevelClick = (level) => {
    setSelectedLevel(level);
    setShowEditLevelModal(true);
  };
  
  // Handle edit position click
  const handleEditPositionClick = (position) => {
    setSelectedPosition(position);
    setShowEditPositionModal(true);
  };

  return (
    <MainLayout>
      <Header title="Configuration" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Levels Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Levels</h2>
            <AdminOnly>
              <Button 
                variant="primary" 
                onClick={() => setShowLevelModal(true)}
              >
                Add Level
              </Button>
            </AdminOnly>
          </div>
          
          {loading.levels ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error.levels ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error.levels}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {levels.length > 0 ? (
                    levels.map((level) => (
                      <tr key={level.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{level.level_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <AdminOnly>
                            <Button
                              variant="text"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => handleEditLevelClick(level)}
                            >
                              Edit
                            </Button>
                          </AdminOnly>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                        No levels found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Positions Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Positions</h2>
            <AdminOnly>
              <Button 
                variant="primary" 
                onClick={() => setShowPositionModal(true)}
              >
                Add Position
              </Button>
            </AdminOnly>
          </div>
          
          {loading.positions ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error.positions ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error.positions}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {positions.length > 0 ? (
                    positions.map((position) => (
                      <tr key={position.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{position.position_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <AdminOnly>
                            <Button
                              variant="text"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => handleEditPositionClick(position)}
                            >
                              Edit
                            </Button>
                          </AdminOnly>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                        No positions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Level Modal */}
      <AddLevelModal 
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        onSave={handleAddLevel}
      />

      {/* Add Position Modal */}
      <AddPositionModal
        isOpen={showPositionModal}
        onClose={() => setShowPositionModal(false)}
        onSave={handleAddPosition}
      />
      
      {/* Edit Level Modal */}
      <EditLevelModal
        isOpen={showEditLevelModal}
        onClose={() => {
          setShowEditLevelModal(false);
          setSelectedLevel(null);
        }}
        onSave={handleUpdateLevel}
        onDelete={handleDeleteLevel}
        level={selectedLevel}
      />
      
      {/* Edit Position Modal */}
      <EditPositionModal
        isOpen={showEditPositionModal}
        onClose={() => {
          setShowEditPositionModal(false);
          setSelectedPosition(null);
        }}
        onSave={handleUpdatePosition}
        onDelete={handleDeletePosition}
        position={selectedPosition}
      />
    </MainLayout>
  );
};

export default Config;