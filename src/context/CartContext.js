import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (service) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === service._id);
      if (exists) return prev.map(i => i._id === service._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...service, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalPrice, totalItems, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
