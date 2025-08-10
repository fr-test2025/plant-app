import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderForm = ({ orders, setOrders, editingOrder, setEditingOrder }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({orderNumber: '', completed: '', description: '', deliveryDate: '' });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        orderNumber: editingOrder.orderNumber,
        description: editingOrder.description,
        completed: editingOrder.completed,
        deliveryDate: editingOrder.deliveryDate,
      });
    } else {
      setFormData({ orderNumber: '', completed: '', description: '', deliveryDate: '' });
    }
  }, [editingOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        const response = await axiosInstance.put(`/api/order/${editingOrder._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(orders.map((order) => (order._id === response.data._id ? response.data : order)));
      } else {
        const response = await axiosInstance.post('/api/order', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders([...orders, response.data]);
      }
      setEditingOrder(null);
      setFormData({ orderNumber: '', completed: '', description: '', deliveryDate: '' });
    } catch (error) {
      alert('Failed to save order.');
      console.log(error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingOrder ? 'Add New Order' : 'Add New Order'}</h1>
      <input
        type="text"
        placeholder="Order Number"
        value={formData.orderNumber}
        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        placeholder="Status"
        value={formData.completed}
        onChange={(e) => setFormData({ ...formData, completed: e.target.value })}
        className="w-64 mb-4 p-2 border rounded"
        >
          <option value="" disabled>Select Status</option>
          <option value="Filled">Filled</option>
          <option value="Not Filled">Not Filled</option>
        </select>
        <div></div>
      <input
        type="date"
        placeholder="Delivery Date"
        value={formData.deliveryDate}
        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
        className="w-64 mb-4 p-2 border rounded"
      />
      <div></div>
      <button type="submit" className="w-20 bg-green-700 text-white p-2 rounded hover:bg-lime-700">
        {editingOrder ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default OrderForm;
