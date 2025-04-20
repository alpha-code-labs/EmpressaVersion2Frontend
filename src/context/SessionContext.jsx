import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Constants
const SESSION_ID_KEY = 'empressa_session_id';
const SESSION_TIMESTAMP_KEY = 'empressa_session_timestamp';
const SESSION_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// Create the context
const SessionContext = createContext();

// Create a custom hook for easier consumption of the context
export const useSession = () => useContext(SessionContext);

// Helper function to clear all cart data from localStorage
const clearAllCartData = () => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('empressa_cart_')) {
      keysToRemove.push(key);
    }
  }
  
  // Remove keys in a separate loop to avoid issues with changing array during iteration
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

export const SessionProvider = ({ children }) => {
  // State for session ID
  const [sessionId, setSessionId] = useState(null);
  // State for cart items
  const [cart, setCart] = useState([]);
  // State for cart animation
  const [cartUpdated, setCartUpdated] = useState(false);
  // Ref to track if initialization has happened
  const initialized = useRef(false);

  // Function to create a new session
  const createNewSession = () => {
    const newSessionId = uuidv4();
    const now = Date.now();
    
    // Clear all previous cart data
    clearAllCartData();
    
    // Store new session data
    localStorage.setItem(SESSION_ID_KEY, newSessionId);
    localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    
    setSessionId(newSessionId);
    setCart([]);
    
    return newSessionId;
  };

  // Initialize session when component mounts - only once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Check if there's an existing session and if it's still valid
    const existingSessionId = localStorage.getItem(SESSION_ID_KEY);
    const sessionTimestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    const now = Date.now();
    
    // Check if session is expired or doesn't exist
    const isSessionExpired = !sessionTimestamp || (now - parseInt(sessionTimestamp)) > SESSION_DURATION;
    
    if (!existingSessionId || isSessionExpired) {
      // Create a new session
      createNewSession();
    } else {
      // Update timestamp for existing session
      localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
      
      // Try to get existing cart from localStorage
      const savedCart = localStorage.getItem(`empressa_cart_${existingSessionId}`);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          setSessionId(existingSessionId);
        } catch (error) {
          // If cart is corrupted, create a new session
          createNewSession();
        }
      } else {
        // Session exists but no cart - just set the session ID
        setSessionId(existingSessionId);
      }
    }
  }, []);

  // Update localStorage whenever cart changes - but only after we have a sessionId
  useEffect(() => {
    if (!sessionId) return;
    
    if (cart.length > 0) {
      localStorage.setItem(`empressa_cart_${sessionId}`, JSON.stringify(cart));
    } else {
      // Remove cart from storage if empty
      localStorage.removeItem(`empressa_cart_${sessionId}`);
    }
  }, [cart, sessionId]);

  // Function to add item to cart
  const addToCart = (product, quantity = 1, size) => {
    if (!sessionId) {
      return;
    }
    
    if (!size && product.sizes && product.sizes.length > 0) {
      // If no size is specified but the product has sizes, default to the first size
      size = product.sizes[0];
    }
    
    setCart(prevCart => {
      // Check if this product (with same size) is already in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity, size }];
      }
    });
    
    // Trigger animation
    setCartUpdated(true);
    
    // Reset the animation state after 600ms
    setTimeout(() => {
      setCartUpdated(false);
    }, 600);
  };

  // Function to remove item from cart
  const removeFromCart = (productId, size) => {
    if (!sessionId) return;
    
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.product.id === productId && item.size === size)
      )
    );
  };

  // Function to update item quantity
  const updateQuantity = (productId, size, quantity) => {
    if (!sessionId) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        (item.product.id === productId && item.size === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Function to clear cart
  const clearCart = () => {
    if (!sessionId) return;
    
    setCart([]);
    localStorage.removeItem(`empressa_cart_${sessionId}`);
  };

  // Function to reset session (for testing)
  const resetSession = () => {
    createNewSession();
  };

  // Calculate cart totals
  const cartTotals = {
    // Total number of items accounting for quantity
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    
    // Number of unique items
    uniqueItemCount: cart.length,
    
    // Calculate price totals
    subtotal: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    originalTotal: cart.reduce((sum, item) => sum + ((item.product.originalPrice || item.product.price) * item.quantity), 0),
  };

  // Value to be provided by the context
  const value = {
    sessionId,
    cart,
    cartUpdated,
    addToCart,
    removeFromCart,
    updateQuantity, 
    clearCart,
    resetSession,
    cartTotals
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;