import React from 'react';
import { Link } from 'react-router-dom';
import './CollectionCard.css';

const CollectionCard = ({ collection }) => {
  const { id, title, imageUrl } = collection;
  // Create a URL-friendly slug from the collection title
  const collectionSlug = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="collection-card">
      <div className="collection-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="collection-image" />
        ) : (
          <div className="collection-image-placeholder">
            <span>Collection Image Coming Soon</span>
          </div>
        )}
      </div>
      <div className="collection-info">
        <h3 className="collection-title">{title}</h3>
        <Link 
          to={`/collection/${collectionSlug}`}
          className="collection-shop-now"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default CollectionCard;