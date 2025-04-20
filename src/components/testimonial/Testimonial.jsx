import React, { useState, useEffect } from 'react';
import './Testimonial.css';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      text: "I never believed clothing could make such a difference in how I feel. The quality and design of my Empressa dress makes me feel powerful and elegant every time I wear it.",
      name: "Priya",
      city: "Noida"
    },
    {
      id: 2,
      text: "The attention to detail is remarkable. From stitching to fabric choice, everything about my Empressa collection pieces speaks of luxury and thoughtfulness in design.",
      name: "Aarti",
      city: "Gurgaon"
    },
    {
      id: 3,
      text: "After wearing Empressa for my important presentation, I received compliments from everyone. These clothes don't just look good - they empower you.",
      name: "Preeti",
      city: "Mumbai"
    },
    {
      id: 4,
      text: "The Eclipsed collection changed how I think about professional attire. Modern, elegant and incredibly well-made - worth every penny.",
      name: "Bhavya",
      city: "Banglore"
    },
    {
      id: 5,
      text: "I've never received more compliments than when wearing my Stripes of Strength dress. The confidence it gives me is beyond words.",
      name: "Lalitha",
      city: "Delhi"
    },
    {
      id: 6,
      text: "When they say 'Bold. Strong. Unstoppable' they mean it. The clothing absolutely makes you feel that way. Customer for life!",
      name: "Annette",
      city: "Poona"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance testimonial every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="testimonial-container">
      <div className="testimonial-content">
        <button className="testimonial-arrow left-arrow" onClick={prevTestimonial}>
          &#10094;
        </button>
        
        <div className="testimonial-slide">
          <div className="quote-marks">"</div>
          <p className="testimonial-text">{testimonials[currentIndex].text}</p>
          <div className="testimonial-author">
            <p className="author-name">{testimonials[currentIndex].name}</p>
            <p className="author-city">{testimonials[currentIndex].city}</p>
          </div>
        </div>
        
        <button className="testimonial-arrow right-arrow" onClick={nextTestimonial}>
          &#10095;
        </button>
      </div>
      
      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;