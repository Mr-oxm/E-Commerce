import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaHome } from 'react-icons/fa';

const ThankYouPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-base-100 shadow-xl rounded-lg p-8 text-center">
        <FaCheckCircle className="text-6xl text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="mb-4">Your order has been successfully placed.</p>
        
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <p className="font-semibold">Order ID: {order._id}</p>
          <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link to={`/order/${order._id}`} className="btn btn-primary">
            <FaBox className="mr-2" /> Track Order
          </Link>
          <Link to="/" className="btn btn-outline">
            <FaHome className="mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage; 