import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    
    // Clean up timer when component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1 className="success-title">Thank You Empressa Lady</h1>
        
        <p className="success-message">Your order has been received</p>
        
        <p className="follow-up-message">
          Our representative will reach out to you shortly on Whatsapp to discuss about your order
        </p>
        
        <p className="alternative-contact">
          Alternatively you can chat with us by clicking the Chat With Us Button at the top
        </p>
        
        <div className="redirect-message">
          <p>Redirecting to home page in 5 seconds...</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;