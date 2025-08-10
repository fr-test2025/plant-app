import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import PlantForm from '../components/PlantForm';
import PlantList from '../components/PlantList';
import { useAuth } from '../context/AuthContext';

const Plants = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/api/plant', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants(response.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <PlantForm
        plants={plants}
        setPlants={setPlants}
        editingPlant={editingPlant}
        setEditingPlant={setEditingPlant}
      />
      <PlantList plants={plants} setPlants={setPlants} setEditingPlant={setEditingPlant} />
    </div>
  );
};

export default Plants;
