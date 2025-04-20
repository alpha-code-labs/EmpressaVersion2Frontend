import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { collectionsData } from '../data/collectionsData';
import './CollectionDetailPage.css';

const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Find the collection by ID or slug
    const foundCollection = collectionsData.find(
      (c) => c.id.toString() === collectionId || 
              c.slug === collectionId || 
             c.title.toLowerCase().replace(/\s+/g, '-') === collectionId.toLowerCase()
    );
    
    if (foundCollection) {
      setCollection(foundCollection);
      setProducts(foundCollection.products || []);
    }
  }, [collectionId]);
  
  if (!collection) {
    return <div className="loading">Loading collection...</div>;
  }
  
  // Determine grid class based on number of products
  const getGridClass = () => {
    if (products.length <= 5) {
      return `products-${products.length}`;
    }
    return '';
  };
  
  // Ensure all price-related fields are properly formatted
  const processedProducts = products.map(product => ({
    ...product,
    price: typeof product.price === 'number' ? product.price : parseInt(product.price || 0),
    originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : parseInt(product.originalPrice || 0),
    discount: typeof product.discount === 'number' ? product.discount : parseInt(product.discount || 0)
  }));
  
  return (
    <div className="collection-detail-page">
      <div className="collection-header">
        <h1 className="collection-title">{collection.title}</h1>
      </div>
      
      <div className="products-container">
        {processedProducts.length === 0 ? (
          <p className="no-products">No products available in this collection yet.</p>
        ) : (
          <div className={`products-grid ${getGridClass()}`}>
            {processedProducts.map((product) => (
              <ProductCard key={product.id} product={product} collectionId={collectionId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;