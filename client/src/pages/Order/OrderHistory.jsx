import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBox, FaClock, FaCalendarAlt, FaDollarSign, FaSort } from 'react-icons/fa';
import routes from '../../constants/routes';
import LoadingAnimation from '../../components/Shared/LoadingAnimation';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const sortedAndFilteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

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
        Order History
      </h1>

      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <select
          className="select select-bordered select-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="return_requested">Return Requested</option>
          <option value="return_approved">Return Approved</option>
          <option value="return_rejected">Return Rejected</option>
        </select>

        <button
          className="btn btn-outline gap-2 btn-sm"
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          <FaSort />
          {sortDirection === 'asc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      <div className="space-y-6">
        {sortedAndFilteredOrders.map((order) => (
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
                  <div className="flex flex-col gap-1 text-sm">
                    <div>
                      <span className="opacity-70">Payment Method: </span>
                      <span className="capitalize">{order.payment.method}</span>
                    </div>
                    <div>
                      <span className="opacity-70">Phone: </span>
                      <span>{order.phoneNumber}</span>
                    </div>
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

        {sortedAndFilteredOrders.length === 0 && (
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