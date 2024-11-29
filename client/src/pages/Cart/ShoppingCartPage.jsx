import React, { useContext, useState } from 'react';
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
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useShoppingCart();
  const [addressError, setAddressError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPhone, setSelectedPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleCheckout = async () => {
    try {
      setAddressError('');
      setPhoneError('');
      
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
        paymentMethod
      };

      const response = await axios.post(routes.order.createOrder, orderData);
      
      if (response.data.success) {
        clearCart();
        navigate('/thank-you', { state: { order: response.data.data } });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error creating order. Please try again.';
      document.querySelector('.error-message').textContent = errorMessage;
    }
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
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
          disabled={cartItems.length === 0}
        >
          <FaCreditCard className="mr-2" /> Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
