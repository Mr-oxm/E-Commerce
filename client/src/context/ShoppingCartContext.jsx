import { createContext, useContext, useState, useEffect } from 'react';

const ShoppingCartContext = createContext();

export const useShoppingCart = () => useContext(ShoppingCartContext);

export const ShoppingCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(() => {
    const saved = localStorage.getItem('selectedAddressIndex');
    return saved ? JSON.parse(saved) : '';
  });

  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState(() => {
    const saved = localStorage.getItem('selectedPhoneIndex');
    return saved ? JSON.parse(saved) : '';
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('selectedAddressIndex', JSON.stringify(selectedAddressIndex));
    localStorage.setItem('selectedPhoneIndex', JSON.stringify(selectedPhoneIndex));
  }, [cartItems, selectedAddressIndex, selectedPhoneIndex]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedAddressIndex('');
    setSelectedPhoneIndex('');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <ShoppingCartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      selectedAddressIndex,
      setSelectedAddressIndex,
      selectedPhoneIndex,
      setSelectedPhoneIndex,
    }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};