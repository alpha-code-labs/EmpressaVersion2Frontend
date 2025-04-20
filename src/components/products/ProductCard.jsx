import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, collectionId }) => {
  const { id, title, price, originalPrice, discount, images } = product;
  
  // Create URL-friendly slugs for product title
  const productSlug = title.toLowerCase().replace(/\s+/g, '-');
  
  // Simple direct rendering based on available props
  const showDiscount = originalPrice && originalPrice > price;
  const discountPercent = discount || (showDiscount ? Math.round(100 * (originalPrice - price) / originalPrice) : null);
   
  return (
    <div className="product-card">
      <Link to={`/collection/${collectionId}/product/${productSlug}`} className="product-link">
        <div className="product-image-container">
          {images && images.length > 0 ? (
            <img src={images[0]} alt={title} className="product-image" />
          ) : (
            <div className="product-image-placeholder">
              <span>Image Coming Soon</span>
            </div>
          )}
        </div>
        
        <div className="product-info">
          <span className="product-title">{title}</span>
          <div className="product-price-container">
            <span className="product-price">₹{price.toLocaleString()}</span>
            
            {showDiscount && (
              <span className="product-original-price">₹{originalPrice.toLocaleString()}</span>
            )}
            
            {discountPercent && (
              <span className="product-discount">{discountPercent}% off</span>
            )}
          </div>
        </div>
      </Link>
      
      <Link to={`/collection/${collectionId}/product/${productSlug}`} className="product-cta-button">
        Shop Now
      </Link>
    </div>
  );
};

export default ProductCard;