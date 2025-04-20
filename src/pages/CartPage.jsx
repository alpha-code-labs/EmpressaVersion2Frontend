import React from 'react';
import { useSession } from '../context/SessionContext';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  // Get all data from context
  const { cart, cartTotals, removeFromCart, updateQuantity } = useSession();
  // Initialize navigate for routing
  const navigate = useNavigate();

  // If there are no items in cart, display empty cart message
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Your Shopping Cart</h1>
          <div className="empty-cart-message">
            <p>Your cart is empty</p>
            <Link to="/">
              <button className="continue-shopping-btn">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle quantity decrease
  const handleDecrease = (productId, size, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, size, currentQuantity - 1);
    }
  };

  // Handle quantity increase
  const handleIncrease = (productId, size, currentQuantity) => {
    updateQuantity(productId, size, currentQuantity + 1);
  };

  // Handle remove item
  const handleRemove = (productId, size) => {
    removeFromCart(productId, size);
  };
  
  // Handle proceed to buy button click
  const handleProceedToBuy = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>

        {/* Proceed to Buy Button */}
        <div className="proceed-to-buy-container">
          <button 
            className="proceed-to-buy-btn"
            onClick={handleProceedToBuy}
          >
            Proceed To Buy
          </button>
        </div>

        {/* Product List */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.product.images && item.product.images[0] || '/images/placeholder.jpg'}
                  alt={item.product.title}
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-title">{item.product.title}</h3>
                <p className="item-size">Size: {item.size}</p>
                <p className="item-price">₹{item.product.price.toLocaleString()}</p>

                <div className="quantity-selector">
                  <button 
                    className="quantity-btn minus"
                    onClick={() => handleDecrease(item.product.id, item.size, item.quantity)}
                    disabled={item.quantity <= 1}
                  >−</button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn plus"
                    onClick={() => handleIncrease(item.product.id, item.size, item.quantity)}
                  >+</button>
                </div>
              </div>

              <button 
                className="remove-item-btn"
                onClick={() => handleRemove(item.product.id, item.size)}
              >×</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Price ({cartTotals.itemCount} items)</span>
            <span>₹{cartTotals.subtotal.toLocaleString()}</span>
          </div>
          
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className="free-delivery">FREE</span>
          </div>

          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{cartTotals.subtotal.toLocaleString()}</span>
          </div>
          
          <p className="tax-note">Inclusive of all taxes</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;