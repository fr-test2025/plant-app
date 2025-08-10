import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PlantList = ({ plants, setPlants, setEditingPlant }) => {
  const { user } = useAuth();

  const handleDelete = async (plantId) => {
    try {
      await axiosInstance.delete(`/api/plant/${plantId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlants(plants.filter((plant) => plant._id !== plantId));
    } catch (error) {
      alert('Failed to delete plant.');
    }
  };

  return (
    <div>
      {plants.map((plant) => (
        <div key={plant._id} className="bg-stone-100 p-4 mb-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">{plant.commonName}</h2>
          <p className="text text-gray-500 italic">{plant.botanicalName}</p>
          <p className="text">{plant.description}</p>
          <p className="text">Stock Count: {plant.stockCount}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingPlant(plant)}
              className="w-20 mr-2 bg-stone-500 text-white px-4 py-2 rounded hover:bg-lime-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(plant._id)}
              className="w-20 bg-pink-700 text-white px-4 py-2 rounded hover:bg-lime-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantList;
