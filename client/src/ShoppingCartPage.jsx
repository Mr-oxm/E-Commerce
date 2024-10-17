import React from 'react';
import { useShoppingCart } from './context/ShoppingCartContext';
import { FaTrash, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useShoppingCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-base-200">
        <FaShoppingCart className="text-9xl mb-4 text-base-content opacity-20" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-base-content opacity-60 mb-4">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-full">
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
              <tr key={item._id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="w-12 h-12">
                        <img src={item.images[0]} alt={item.name} width={512} height={512} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="input input-bordered w-20"
                  />
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => removeFromCart(item._id)} className="btn btn-ghost btn-sm">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <button className="btn btn-primary">
          <FaCreditCard className="mr-2" /> Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
