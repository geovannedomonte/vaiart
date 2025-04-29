// src/contexts/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (produto, quantidade) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.produto.id === produto.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.produto.id === produto.id 
            ? { ...item, quantidade: item.quantidade + quantidade } 
            : item
        );
      } else {
        return [...prevCart, { produto, quantidade }];
      }
    });
  };
  
  const removeFromCart = (produtoId) => {
    setCart(prevCart => prevCart.filter(item => item.produto.id !== produtoId));
  };
  
  const updateQuantity = (produtoId, quantidade) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.produto.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + item.produto.preco * item.quantidade, 
      0
    );
  };
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};