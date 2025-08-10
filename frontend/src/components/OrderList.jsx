import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderList = ({ orders, setOrders, setEditingOrder }) => {
  const { user } = useAuth();

  const handleDelete = async (orderId) => {
    try {
      await axiosInstance.delete(`/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      alert('Failed to delete order.');
    }
  };

  return (
    <div>
      {orders.map((order) => (
        <div key={order._id} className="bg-stone-100 p-4 mb-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">{order.orderNumber}</h2>
          <p className="text text-pink-700 italic">{order.completed}</p>
          <p className="text">{order.description}</p>
          <p className="text">Delivery Date: {new Date(order.deliveryDate).toLocaleDateString("en-AU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
          })}

          </p>
          <div className="mt-2">
            <button
              onClick={() => setEditingOrder(order)}
              className="w-20 mr-2 bg-stone-500 text-white px-4 py-2 rounded hover:bg-lime-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(order._id)}
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

export default OrderList;
