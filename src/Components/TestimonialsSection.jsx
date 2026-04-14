import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from './I18nProvider';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const { t } = useI18n();
  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const testimonials = [
    {
      name: 'Ahmed B.',
      review: t('testimonial1'),
      rating: 5,
      image: 'https://via.placeholder.com/60x60?text=A'
    },
    {
      name: 'Fatima K.',
      review: t('testimonial2'),
      rating: 4.5,
      image: 'https://via.placeholder.com/60x60?text=F'
    },
    {
      name: 'Mohamed R.',
      review: t('testimonial3'),
      rating: 5,
      image: 'https://via.placeholder.com/60x60?text=M'
    },
    {
      name: 'Amina S.',
      review: t('testimonial4'),
      rating: 5,
      image: 'https://via.placeholder.com/60x60?text=A'
    },
  ];

  // Duplicate for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    return stars;
  };

  // Auto scroll functionality - smoother scrolling
  useEffect(() => {
    let intervalId;
    if (isAutoScrolling && scrollContainerRef.current) {
      intervalId = setInterval(() => {
        // Smooth scroll by 1px for better visual effect
        scrollContainerRef.current.scrollLeft += 1;
        // Reset scroll position when it reaches the end of first set
        if (scrollContainerRef.current.scrollLeft >= 
            scrollContainerRef.current.scrollWidth / 2) {
          scrollContainerRef.current.scrollLeft = 0;
        }
      }, 16); // ~60fps for smoother animation
    }
    return () => clearInterval(intervalId);
  }, [isAutoScrolling]);

// Manual scroll functions - scroll by exact card width with fallback
   const scrollLeft = () => {
     if (scrollContainerRef.current) {
       // Use fixed values that match CSS to avoid timing issues
       const cardWidth = 280; // Matches CSS width
       const gap = 32; // 2rem = 32px
       scrollContainerRef.current.scrollLeft -= (cardWidth + gap);
     }
   };

   const scrollRight = () => {
     if (scrollContainerRef.current) {
       // Use fixed values that match CSS to avoid timing issues
       const cardWidth = 280; // Matches CSS width
       const gap = 32; // 2rem = 32px
       scrollContainerRef.current.scrollLeft += (cardWidth + gap);
     }
   };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  return (
    <section className="testimonials">
      <h2>{t('testimonialsTitle')}</h2>
      <div className="testimonials-container">
        {/* Navigation buttons */}
        <button 
          className="nav-button nav-left" 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          &#9664;
        </button>
        
        <div 
          className="testimonials-scroll" 
          ref={scrollContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="testimonial-image"
              />
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="testimonial-review">"{testimonial.review}"</p>
                <p className="testimonial-name">- {testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="nav-button nav-right" 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          &#9654;
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;