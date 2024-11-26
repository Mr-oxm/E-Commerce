import React, { useContext } from 'react';
import axios from 'axios';
import routes from '../../constants/routes';
import { AuthContext } from '../../context/AuthContext';
import LoadingAnimation from '../Shared/LoadingAnimation';
import { FaTruck } from 'react-icons/fa';

const OrderList = ({ orders, loading, onStatusUpdate }) => {
  const { user } = useContext(AuthContext);

  const handleStatusChange = async (orderId, productId, status) => {
    try {
      await axios.put(routes.order.updateOrderStatus(orderId), {
        productId,
        status
      });
      onStatusUpdate(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusOptions = (currentStatus) => {
    // Return-specific status options
    if (currentStatus === 'return_requested' || currentStatus === 'return_approved' || currentStatus === 'return_rejected') {
      return [
        { value: 'return_requested', label: 'Return Requested' },
        { value: 'return_approved', label: 'Approve Return' },
        { value: 'return_rejected', label: 'Reject Return' }
      ];
    }

    // Regular status options
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
  };

  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">No orders found</h2>
        <p className="text-gray-500">You haven't received any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
      <div className="overflow-x-auto">
        {orders.map((order) => {
          // Filter products for this seller
          const sellerProducts = order.products.filter(p => p.seller.toString() === user._id);
          
          // Skip orders with no products for this seller
          if (sellerProducts.length === 0) return null;

          return (
            <div key={order._id} className="mb-8 bg-base-100 card p-4 overflow-x-auto">
              <div className=" pb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className='flex justify-between items-center'>
                    <span className="font-bold">Order #{order._id}</span>
                    <span className="mx-4 text-sm opacity-70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="opacity-70">Buyer: </span>
                    <span className="font-medium">{order.buyer?.profile?.fullName || 'Anonymous'}</span>
                  </div>
                </div>
              </div>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.map((product) => (
                    <tr key={`${order._id}-${product._id}`} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12">
                              <img 
                                src={product.product.images[0]} 
                                alt={product.product.name}
                                onError={(e) => e.target.src = '/placeholder.png'}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{product.product.name}</div>
                            {product.selectedVariations && product.selectedVariations.length > 0 && (
                              <div className="text-sm opacity-70">
                                {product.selectedVariations.map((variation, index) => (
                                  <div key={index}>
                                    {variation.name}: {variation.option}
                                    {variation.price > 0 && (
                                      <span className="text-content">
                                        {` (+$${variation.price.toFixed(2)})`}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="text-sm opacity-50 truncate">PID: {product.product._id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.quantity}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="select select-bordered select-sm w-full min-w-36"
                          value={product.status}
                          onChange={(e) => handleStatusChange(order._id, product._id, e.target.value)}
                          disabled={['delivered', 'cancelled', 'return_rejected', 'return_approved'].includes(product.status)}
                        >
                          {getStatusOptions(product.status).map(option => (
                            <option 
                              key={option.value} 
                              value={option.value}
                              disabled={option.value === product.status}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center gap-2 mt-4">
                <FaTruck className='text-primary' />
                <span>Delivery Address: {order.shippingAddress}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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

export default OrderList;
  