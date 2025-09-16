import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PlantForm = ({ plants, setPlants, editingPlant, setEditingPlant }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '', price: '',});

  useEffect(() => {
    if (editingPlant) {
      setFormData({
        botanicalName: editingPlant.botanicalName,
        commonName: editingPlant.commonName,
        seasonality: editingPlant.seasonality,
        description: editingPlant.description,
        stockCount: editingPlant.stockCount,
        price: editingPlant.price || '',
      });
    } else {
      setFormData({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '', price: '',});
    }
  }, [editingPlant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlant) {
        const response = await axiosInstance.put(`/api/plant/${editingPlant._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants(plants.map((plant) => (plant._id === response.data._id ? response.data : plant)));
      } else {
        const response = await axiosInstance.post('/api/plant', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants([...plants, response.data]);
      }
      setEditingPlant(null);
      setFormData({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '', price: '' });
    } catch (error) {
      alert('Failed to save plant.');
      console.log(error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingPlant ? 'Add New Plant' : 'Add New Plant'}</h1>
      <input
        type="text"
        placeholder="Botanical Name"
        value={formData.botanicalName}
        onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Common Name"
        value={formData.commonName}
        onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        placeholder="Seasonality"
        value={formData.seasonality}
        onChange={(e) => setFormData({ ...formData, seasonality: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        >
          <option value="" disabled>Select a season</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Autumn">Autumn</option>
          <option value="Winter">Winter</option>
        </select>
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Stock Count"
        value={formData.stockCount}
        onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price || ''}
        min="0"
        step="1"
        onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/\D/g, '') })}
        className="pl-6 p-2 border rounded w-full"
      />  
      <button type="submit" className="w-20 bg-green-700 text-white p-2 rounded hover:bg-lime-700">
        {editingPlant ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default PlantForm;
