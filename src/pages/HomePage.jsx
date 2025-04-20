import React from 'react';
import CollectionGrid from '../components/collections/CollectionGrid';
import Testimonial from '../components/testimonial/Testimonial';
import './HomePage.css';

// Import all collection images
import eclipsedImg from '../assets/Eclipsed.jpg';
import stripesImg from '../assets/StripesOfStrength.jpg';
import emberImg from '../assets/EmpoweredEmber.jpg';
import mintImg from '../assets/MintedResolve.jpg';
import radiantImg from '../assets/RadiantRebellion.jpg';

const HomePage = () => {
  // Collection data
  const collections = [
    {
      id: 1,
      title: "Eclipsed",
      imageUrl: eclipsedImg
    },
    {
      id: 2,
      title: "Stripes of Strength",
      imageUrl: stripesImg
    },
    {
      id: 3,
      title: "Empowered Ember",
      imageUrl: emberImg
    },
    {
      id: 4,
      title: "Minted Resolve",
      imageUrl: mintImg
    },
    {
      id: 5,
      title: "Radiant Rebellion",
      imageUrl: radiantImg
    }
  ];
  
  return (
    <div className="home-page">
      <section className="hero-section">
        <h2 className="page-title">EMPRESSA LEGACY COLLECTION</h2>
      </section>
      
      <CollectionGrid collections={collections} />
      
      <section className="testimonial-section">
        <h2 className="page-title">OUR CUSTOMERS LOVE US</h2>
        <Testimonial />
      </section>
    </div>
  );
};

export default HomePage;