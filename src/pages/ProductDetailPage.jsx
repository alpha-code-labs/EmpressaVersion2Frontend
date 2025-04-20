import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collectionsData } from '../data/collectionsData';
import { useSession } from '../context/SessionContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { collectionSlug, productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const mainImageRef = useRef(null);
  const magnifierRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  
  // Get session context
  const { addToCart } = useSession();

  useEffect(() => {
    // Find the collection based on its slug
    const foundCollection = collectionsData.find(
      (c) => c.slug === collectionSlug || c.title.toLowerCase().replace(/\s+/g, '-') === collectionSlug
    );

    if (!foundCollection) {
      setError('Collection not found');
      setLoading(false);
      return;
    }

    setCollection(foundCollection);

    // Find the product in the collection based on the product slug
    // Convert product titles to slugs for comparison
    const foundProduct = foundCollection.products.find(
      (p) => p.slug === productSlug || p.title.toLowerCase().replace(/\s+/g, '-') === productSlug
    );

    if (!foundProduct) {
      setError('Product not found');
      setLoading(false);
      return;
    }

    setProduct(foundProduct);
    
    // Set the main image if images are available
    if (foundProduct.images && foundProduct.images.length > 0) {
      setMainImage(foundProduct.images[0]);
    }
    
    // Set default selected size if available
    if (foundProduct.sizes && foundProduct.sizes.length > 0) {
      setSelectedSize(foundProduct.sizes[0]);
    }
    
    setLoading(false);
  }, [collectionSlug, productSlug]);

  // Set up magnifier after the component mounts and when mainImage changes
  useEffect(() => {
    if (!mainImageRef.current || !containerRef.current) return;
    
    // Create magnifier glass if it doesn't exist
    if (!magnifierRef.current) {
      const glass = document.createElement("div");
      glass.className = "img-magnifier-glass";
      containerRef.current.appendChild(glass);
      magnifierRef.current = glass;
    }
    
    const glass = magnifierRef.current;
    const img = mainImageRef.current;
    const zoom = 3; // Zoom level
    
    // Set background properties for the magnifier glass
    glass.style.backgroundImage = `url('${mainImage || (product?.images?.[0])}')`;
    glass.style.backgroundRepeat = "no-repeat";
    
    // Add mouse event listeners to the image
    const handleMouseMove = (e) => {
      // Only enable on desktop
      if (window.innerWidth <= 768) return;
      
      e.preventDefault();
      
      // Get image dimensions and position
      const rect = img.getBoundingClientRect();
      
      // Calculate cursor position relative to the image
      const x = e.pageX - rect.left - window.pageXOffset;
      const y = e.pageY - rect.top - window.pageYOffset;
      
      // Width and height of the magnifier
      const w = glass.offsetWidth / 2;
      const h = glass.offsetHeight / 2;
      
      // Prevent the magnifier from going outside the image
      let posX = x;
      let posY = y;
      
      if (posX > img.width - (w / zoom)) posX = img.width - (w / zoom);
      if (posX < w / zoom) posX = w / zoom;
      if (posY > img.height - (h / zoom)) posY = img.height - (h / zoom);
      if (posY < h / zoom) posY = h / zoom;
      
      // Position the magnifier glass
      glass.style.left = (posX - w) + "px";
      glass.style.top = (posY - h) + "px";
      
      // Show the magnified portion of the image
      glass.style.backgroundPosition = `-${((x * zoom) - w)}px -${((y * zoom) - h)}px`;
      glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
    };
    
    const handleMouseEnter = () => {
      if (window.innerWidth > 768) {
        glass.style.display = "block";
      }
    };
    
    const handleMouseLeave = () => {
      glass.style.display = "none";
    };
    
    // Add event listeners
    img.addEventListener("mousemove", handleMouseMove);
    img.addEventListener("mouseenter", handleMouseEnter);
    img.addEventListener("mouseleave", handleMouseLeave);
    
    // Cleanup
    return () => {
      img.removeEventListener("mousemove", handleMouseMove);
      img.removeEventListener("mouseenter", handleMouseEnter);
      img.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mainImage, product]);
  
  // Cleanup magnifier on unmount
  useEffect(() => {
    return () => {
      if (magnifierRef.current && magnifierRef.current.parentNode) {
        magnifierRef.current.parentNode.removeChild(magnifierRef.current);
      }
    };
  }, []);

  // Function to handle thumbnail click
  const handleThumbnailClick = (imageSrc) => {
    setMainImage(imageSrc);
  };
  
  // Function to get similar products with the same category
  const getSimilarProducts = (currentProduct) => {
    if (!currentProduct || !currentProduct.Category) {
      return [];
    }
    
    // Find products across all collections with the same category
    const similarProducts = [];
    
    collectionsData.forEach(coll => {
      // Add products from all collections with matching category
      const matchingProducts = coll.products.filter(p => 
        // Avoid showing the current product
        !(p.id === currentProduct.id && coll.slug === collectionSlug) && 
        p.Category === currentProduct.Category
      ).map(p => ({
        ...p,
        collectionSlug: coll.slug // Save the collection slug with each product
      }));
      
      similarProducts.push(...matchingProducts);
    });
    
    // Shuffle and limit to 4 recommendations (2 rows of 2)
    return similarProducts
      .sort(() => 0.5 - Math.random()) // Simple shuffle
      .slice(0, 4); 
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };
  
  // Handle add to cart button click
  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }
    
    // Add product to cart using SessionContext
    addToCart(product, 1, selectedSize);
  };
  
  // Handle buy now button click
  const handleBuyNow = () => {
    if (!product) return;
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }
    
    // Add to cart first
    addToCart(product, 1, selectedSize);
    
    // Redirect to checkout page
    navigate('/cart');
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // For testing - let's create dummy images if none exist
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['/images/placeholder.jpg', '/images/placeholder.jpg', '/images/placeholder.jpg'];

  // Calculate discount percentage if not provided
  const discountPercent = product.discount || 
    (product.originalPrice ? Math.round(100 * (product.originalPrice - product.price) / product.originalPrice) : null);

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Left side - Product Images */}
        <div className="product-images-section">
          <div className="main-image-container img-magnifier-container" ref={containerRef}>
            <img 
              ref={mainImageRef}
              src={mainImage || productImages[0]} 
              alt={product.title} 
              className="main-product-image" 
              style={{ cursor: window.innerWidth > 768 ? 'crosshair' : 'default' }}
            />
          </div>
          
          {/* Thumbnails Gallery */}
          <div className="product-thumbnails">
            {productImages.map((image, index) => (
              <div 
                key={index} 
                className={`thumbnail-container ${mainImage === image ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(image)}
              >
                <img 
                  src={image} 
                  alt={`${product.title} - View ${index + 1}`} 
                  className="thumbnail-image" 
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Center - Product Info */}
        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-price-section">
            <div className="product-price-row">
              <span className="product-current-price">₹{product.price.toLocaleString()}</span>
              
              {product.originalPrice && (
                <>
                  <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>
                  
                  {discountPercent && (
                    <span className="product-discount-tag">{discountPercent}% off</span>
                  )}
                </>
              )}
            </div>
            <p className="tax-info">Inclusive of all taxes</p>
          </div>
          
          {/* Product details (Material, SleeveStyle, Neck) */}
          <div className="product-details-section">
            <div className="product-detail-item">
              <span className="detail-label">Material:</span>
              <span className="detail-value">{product.Material || "Cotton Blend"}</span>
            </div>
            
            <div className="product-detail-item">
              <span className="detail-label">Sleeve Style:</span>
              <span className="detail-value">{product.SleeveStyle || "Regular"}</span>
            </div>
            
            <div className="product-detail-item">
              <span className="detail-label">Neck:</span>
              <span className="detail-value">{product.Neck || "Round Neck"}</span>
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="size-selection-container">
            <h3 className="selection-title">Select Size</h3>
            <div className="size-options">
              {product.sizes && product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add To Cart</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
        
        {/* Right side - Recommendations */}
        <div className="recommendations-section">
          <h2 className="recommendations-title">We Recommend</h2>
          <div className="recommendations-grid">
            {getSimilarProducts(product).map((similarProduct) => (
              <div key={similarProduct.id} className="recommendation-card">
                <Link 
                  to={`/collection/${similarProduct.collectionSlug}/product/${similarProduct.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="recommendation-link"
                >
                  <div className="recommendation-image-container">
                    {similarProduct.images && similarProduct.images.length > 0 ? (
                      <img 
                        src={similarProduct.images[0]} 
                        alt={similarProduct.title} 
                        className="recommendation-image" 
                      />
                    ) : (
                      <div className="recommendation-placeholder">
                        <span>Image Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <h3 className="recommendation-title">{similarProduct.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;