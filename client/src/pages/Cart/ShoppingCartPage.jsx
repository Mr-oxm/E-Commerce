import React, { useContext, useState, useEffect } from 'react';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { FaTrash, FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import routes from '../../constants/routes';

import EmptyCart from '../../components/Cart/EmptyCart';
import CartItem from '../../components/Cart/CartItem';
import ShippingForm from '../../components/Cart/ShippingForm';
import PaymentMethod from '../../components/Cart/PaymentMethod';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, selectedAddressIndex, selectedPhoneIndex } = useShoppingCart();
  const [addressError, setAddressError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPhone, setSelectedPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user?.profile?.addresses && selectedAddressIndex !== '') {
      setSelectedAddress(user.profile.addresses[selectedAddressIndex]?.value || '');
    }
    if (user?.profile?.phoneNumbers && selectedPhoneIndex !== '') {
      setSelectedPhone(user.profile.phoneNumbers[selectedPhoneIndex]?.value || '');
    }
  }, [user, selectedAddressIndex, selectedPhoneIndex]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const token = urlParams.get('token');
    const PayerID = urlParams.get('PayerID');

    if (paymentId && token && PayerID && selectedAddress && selectedPhone) {
      axios.get(routes.payment.executePayPalPayment(paymentId, PayerID))
        .then(response => {
          console.log("response", response);
          if (response.data.success) {
            console.log("paymentId", paymentId);
            handleCheckout(paymentId, true);
          }
        })
        .catch(error => {
          console.log("error", error);
          setErrorMessage(error.response?.data?.error || 'Payment execution failed');
        });
    }
  }, [selectedAddress, selectedPhone]);

  const handleCheckout = async (paymentId = null, paypalPayment = false) => {
    try {
      setAddressError('');
      setPhoneError('');
      setIsProcessingPayment(true);
      
      if (!selectedAddress) {
        setAddressError('Please select a shipping address');
        return;
      }

      if (!selectedPhone) {
        setPhoneError('Please select a contact phone number');
        return;
      }

      const orderData = {
        products: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          seller: item.seller,
          selectedVariations: item.selectedVariations || []
        })),
        shippingAddress: selectedAddress,
        phoneNumber: selectedPhone,
        paymentMethod: paypalPayment ? 'credit' : paymentMethod,
      };
      if(paymentId && paypalPayment) {
        orderData.paymentId = paymentId;
      }

      if (paymentMethod === 'credit' && !paypalPayment) {
        const response = await axios.post(routes.payment.createPayPalPayment, orderData);
        if (response.data.success) {
          // Redirect to PayPal
          window.location.href = response.data.approvalUrl;
        }
      } else {
        const response = await axios.post(routes.order.createOrder, orderData);
        if (response.data.success) {
          clearCart();
          navigate('/thank-you', { state: { order: response.data.data } });
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error processing payment. Please try again.';
      document.querySelector('.error-message').textContent = errorMessage;
    } finally {
      setIsProcessingPayment(false);
    }
  };


  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {errorMessage && (
        <div className="alert alert-error mb-4">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShippingForm
          user={user}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          addressError={addressError}
          selectedPhone={selectedPhone}
          setSelectedPhone={setSelectedPhone}
          phoneError={phoneError}
        />
        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={clearCart} className="btn btn-error">
          <FaTrash className="mr-2" /> Clear Cart
        </button>
        <div className="text-xl">
          Total: <span className="font-bold">${getCartTotal().toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          className="btn btn-primary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || isProcessingPayment}
        >
          {isProcessingPayment ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <FaCreditCard className="mr-2" /> 
              {paymentMethod === 'credit' ? 'Pay with Credit Card' : 'Proceed to Checkout'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
