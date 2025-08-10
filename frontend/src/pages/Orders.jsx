import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/order', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(response.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <OrderForm
        orders={orders}
        setOrders={setOrders}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
      />
      <OrderList orders={orders} setOrders={setOrders} setEditingOrder={setEditingOrder} />
    </div>
  );
};

export default Orders;
