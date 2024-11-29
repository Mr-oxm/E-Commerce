import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaTruck, FaUndo, FaTimes, FaPhone, FaCreditCard } from 'react-icons/fa';
import routes from '../../constants/routes';
import { useParams } from 'react-router-dom';
import Modal from '../Shared/Model';
import LoadingAnimation from '../Shared/LoadingAnimation';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(routes.order.getOrderById(id));
        if (mounted) {
          setOrder(response.data.data);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching order:', error);
          setError(error.response?.data?.error || 'Failed to fetch order');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [id]);

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

  const handleReturn = async () => {
    try {
      setLoading(true);
      await axios.post(routes.order.returnOrder(id), { 
        reason: returnReason,
        productIds: selectedProducts 
      });
      const response = await axios.get(routes.order.getOrderById(id));
      setOrder(response.data.data);
      setSelectedProducts([]);
      setReturnReason('');
    } catch (error) {
      console.error('Error returning order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      await axios.put(routes.order.cancelOrder(id));
      const response = await axios.get(routes.order.getOrderById(id));
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) return <LoadingAnimation />;
  if (error) return <div className="text-error">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      <div className="card bg-base-100">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-4 ">
              <FaBox className="text-2xl text-primary" />
              <div>
                <h2 className="text-xl font-bold">Order #{order._id}</h2>
                <p className="text-base-content/60 truncate max-w-full overflow-hidden">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className={`badge ${getStatusBadgeColor(order.status)} badge-lg`}>
              {order.status}
            </div>
          </div>

          {order.status === 'delivered' && (
            <div className="alert alert-info mb-4">
              <FaUndo className="text-lg" />
              <span>Select the products you want to return by checking the boxes below.</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  {order.status === 'delivered' && (
                    <th className="w-16">
                      Return
                    </th>
                  )}
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item) => (
                  <tr key={item._id} className={selectedProducts.includes(item._id) ? 'bg-base-200' : ''}>
                    {order.status === 'delivered' && (
                      <td>
                        {item.status === 'delivered' ? (
                          <label className="cursor-pointer flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary"
                              checked={selectedProducts.includes(item._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts([...selectedProducts, item._id]);
                                } else {
                                  setSelectedProducts(selectedProducts.filter(id => id !== item._id));
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="tooltip" data-tip="Can only return delivered items">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-disabled"
                              disabled
                            />
                          </div>
                        )}
                      </td>
                    )}
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-12 h-12">
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              className="rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.product.name}</div>
                          {item.selectedVariations && item.selectedVariations.length > 0 && (
                            <div className="text-sm text-base-content/70">
                              {item.selectedVariations.map((variation, index) => (
                                <div key={index}>
                                  {variation.name}: {variation.option}
                                  {variation.price > 0 && ` (+$${variation.price.toFixed(2)})`}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <div className={`badge ${getStatusBadgeColor(item.status)} badge-lg`}>
                        {item.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center text-lg p-4 rounded-lg">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
            </div>


            <div className="card-body flex md:flex-row flex-col gap-6 items-center flex-wrap">
              <div className="flex items-center gap-3">
                <FaTruck className="text-xl text-primary" />
                <div>
                  <h3 className="font-semibold">Shipping Address</h3>
                  <p className="text-base-content/70">{order.shippingAddress}</p>
                </div>
              </div>
              
              {order.phoneNumber && (
                
                <div className="flex items-center gap-3">
                  <FaPhone className="text-xl text-primary" />
                  <div>
                    <h3 className="font-semibold">Contact Phone</h3>
                    <p className="text-base-content/70">{order.phoneNumber}</p>
                  </div>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-xl text-primary" />
                  <div>
                    <h3 className="font-semibold">Payment Method</h3>
                    <p className="text-base-content/70">{order.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>

            {order.products.every(p => p.status === 'pending') && (
              <Modal 
                title="Cancel Order" 
                className="btn btn-error w-full"
                content={
                  <div className='space-y-4'>
                    <p>Are you sure you want to cancel this order?</p>
                    <button 
                      className={`btn btn-error w-full ${loading ? 'loading' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCancel();
                      }}
                      disabled={loading}
                    >
                      <FaTimes className="mr-2" /> Cancel Order
                    </button>
                  </div>
                } 
              />
            )}
            {order.status === 'delivered' && (
              <Modal 
                title="Request Return" 
                className="btn btn-warning w-full"
                disabled={selectedProducts.length === 0}
                buttonText={
                  selectedProducts.length === 0 
                    ? "Select Products to Return" 
                    : `Return ${selectedProducts.length} Selected Items`
                }
                content={
                  <form className="space-y-4">
                    <div className="alert alert-info">
                      <div>
                        <h3 className="font-bold">Selected Products:</h3>
                        <ul className="list-disc pl-4 mt-2">
                          {order.products
                            .filter(item => selectedProducts.includes(item._id))
                            .map(item => (
                              <li key={item._id}>
                                {item.product.name} - ${item.price.toFixed(2)}
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Return Reason</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Please explain why you want to return these products"
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <button 
                      className={`btn btn-warning w-full ${loading ? 'loading' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleReturn();
                      }}
                      disabled={loading || !returnReason || selectedProducts.length === 0}
                    >
                      <FaUndo className="mr-2" /> Submit Return Request
                    </button>
                  </form>
                } 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 