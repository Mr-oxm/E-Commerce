import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBox, FaClock, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import routes from '../../constants/routes';
import LoadingAnimation from '../../components/Shared/LoadingAnimation';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(routes.order.getOrderHistory);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-error',
      return_requested: 'badge-warning',
      return_approved: 'badge-info',
      return_rejected: 'badge-error'
    };
    return colors[status] || 'badge-ghost';
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaBox className="text-primary" />
        Order History
      </h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="card bg-base-100">
            <div className="card-body">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary" />
                    <h2 className="card-title">Order #{order._id}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaCalendarAlt />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <div className={`badge ${getStatusBadgeColor(order.status)} badge-lg`}>
                    {order.status}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="badge badge-outline">
                      {product.quantity}x {product.product.name}
                    </div>
                  ))}
                </div>
                <Link 
                  to={`/order/${order._id}`} 
                  className="btn btn-primary btn-sm gap-2"
                >
                  <FaBox />
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-8">
            <FaBox className="text-4xl text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/50">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 