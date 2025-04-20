import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotals, clearCart } = useSession();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state for payment processing
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) 
      newErrors.phone = 'Phone number must be 10 digits';
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode.replace(/[^0-9]/g, '')))
      newErrors.pincode = 'PIN code must be 6 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle payment verification
  const handlePaymentVerification = (response) => {
    // Retrieve order data from localStorage
    const storedCustomerData = JSON.parse(localStorage.getItem('checkout_customer_data'));
    const storedOrderDetails = JSON.parse(localStorage.getItem('checkout_order_details'));
    
    // Send verification data to backend with order details
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://ecommercebackendempressav2-hqhshmggcff5gndj.centralindia-01.azurewebsites.net/api/verify-payment', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        
        if (data.success) {
          // Payment verification successful
          // Clear checkout data from localStorage
          localStorage.removeItem('checkout_customer_data');
          localStorage.removeItem('checkout_order_details');
          
          clearCart();
          navigate('/order-success');
        } else {
          alert("Payment verification failed. Please contact support.");
        }
      } else {
        alert("Payment verification error. Please contact support.");
      }
      setIsProcessing(false);
    };
    xhr.onerror = function() {
      alert("Network error during verification. Please contact support.");
      setIsProcessing(false);
    };
    
    // Add order details to verification request
    const verificationData = {
      ...response, // Contains razorpay_payment_id, razorpay_order_id, razorpay_signature
      customerData: storedCustomerData,
      orderDetails: storedOrderDetails
    };
    
    xhr.send(JSON.stringify(verificationData));
  };
  
  // Open Razorpay payment modal
  const openRazorpayCheckout = (orderData) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Your Store Name",
      description: "Purchase from Your Store",
      order_id: orderData.orderId,
      handler: function(response) {
        handlePaymentVerification(response);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: formData.address
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };
    
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      try {
        // Prepare order data
        const currentCustomerData = formData;
        const currentOrderDetails = cart.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          size: item.size,
          quantity: item.quantity
        }));
        
        // Store in localStorage for persistence during payment flow
        localStorage.setItem('checkout_customer_data', JSON.stringify(currentCustomerData));
        localStorage.setItem('checkout_order_details', JSON.stringify(currentOrderDetails));
        
        // Create the request data
        const requestData = {
          customerData: currentCustomerData,
          orderDetails: currentOrderDetails
        };
        
        // Using XMLHttpRequest instead of fetch
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://ecommercebackendempressav2-hqhshmggcff5gndj.centralindia-01.azurewebsites.net/api/create-order', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            
            if (data.success) {
              // Open Razorpay checkout
              openRazorpayCheckout(data);
            } else {
              // Clear localStorage if order creation failed
              localStorage.removeItem('checkout_customer_data');
              localStorage.removeItem('checkout_order_details');
              
              alert("Could not create order. Please try again.");
              setIsProcessing(false);
            }
          } else {
            // Clear localStorage on error
            localStorage.removeItem('checkout_customer_data');
            localStorage.removeItem('checkout_order_details');
            
            alert("Server error. Please try again later.");
            setIsProcessing(false);
          }
        };
        xhr.onerror = function() {
          // Clear localStorage on network error
          localStorage.removeItem('checkout_customer_data');
          localStorage.removeItem('checkout_order_details');
          
          alert("Network error. Please check your connection and try again.");
          setIsProcessing(false);
        };
        xhr.send(JSON.stringify(requestData));
      } catch (error) {
        // Clear localStorage on any error
        localStorage.removeItem('checkout_customer_data');
        localStorage.removeItem('checkout_order_details');
        
        alert("Something went wrong. Please try again later.");
        setIsProcessing(false);
      }
    }
  };
  
  // Redirect to cart if cart is empty
  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before proceeding to checkout.</p>
        <button 
          className="continue-shopping-btn"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-container">
        {/* Left side - Checkout form */}
        <div className="checkout-form-section">
          <h2 className="section-title">Shipping Information</h2>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                required
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Shipping Address <span className="required">*</span></label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
                rows="3"
                required
              ></textarea>
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City <span className="required">*</span></label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                  required
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State <span className="required">*</span></label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'error' : ''}
                  required
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="pincode">PIN Code <span className="required">*</span></label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? 'error' : ''}
                  required
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="payment-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
        
        {/* Right side - Order summary */}
        <div className="order-summary-section">
          <h2 className="section-title">Order Summary</h2>
          
          <div className="cart-items-summary">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <div className="item-image">
                  <img 
                    src={item.product.images[0] || '/images/placeholder.jpg'} 
                    alt={item.product.title} 
                  />
                </div>
                <div className="item-details">
                  <h3>{item.product.title}</h3>
                  <p className="item-size">Size: {item.size}</p>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                  <p className="item-price">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="price-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{cartTotals.subtotal.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{cartTotals.subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;