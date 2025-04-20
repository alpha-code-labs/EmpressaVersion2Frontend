import React from 'react';
import CollectionCard from './CollectionCard';
import './CollectionGrid.css';

const CollectionGrid = ({ collections }) => {
  return (
    <div className="collection-grid-container">
      <div className="collection-grid">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-grid-item">
            <CollectionCard collection={collection} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionGrid;
