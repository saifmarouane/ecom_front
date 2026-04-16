import React, { useMemo, useRef } from 'react';
import { useI18n } from './I18nProvider';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const { t } = useI18n();
  const scrollContainerRef = useRef(null);

  const avatarDataUri = (initial) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f6c344"/>
            <stop offset="1" stop-color="#ec7f34"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#g)"/>
        <text x="60" y="72" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI" font-size="56" font-weight="700" fill="#1b120c">${String(initial || '?').slice(0, 1)}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const testimonials = useMemo(
    () => [
      { name: "Ahmed B.", review: t("testimonial1"), rating: 5, image: avatarDataUri("A") },
      { name: "Fatima K.", review: t("testimonial2"), rating: 4.5, image: avatarDataUri("F") },
      { name: "Mohamed R.", review: t("testimonial3"), rating: 5, image: avatarDataUri("M") },
      { name: "Amina S.", review: t("testimonial4"), rating: 5, image: avatarDataUri("A") },
    ],
    [t]
  );

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

  // Manual scroll functions - scroll by exact card width with fallback
	   const scrollLeft = () => {
	     if (scrollContainerRef.current) {
	       // Use fixed values that match CSS to avoid timing issues
	       const cardWidth = 280; // Matches CSS width
	       const gap = 32; // 2rem = 32px
	       scrollContainerRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
	     }
	   };

	   const scrollRight = () => {
	     if (scrollContainerRef.current) {
	       // Use fixed values that match CSS to avoid timing issues
	       const cardWidth = 280; // Matches CSS width
	       const gap = 32; // 2rem = 32px
	       scrollContainerRef.current.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
	     }
	   };

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
	        >
	          {testimonials.map((testimonial, index) => (
	            <div key={index} className="testimonial-card">
	              <img 
	                src={testimonial.image} 
	                alt={testimonial.name} 
	                width={90}
	                height={90}
	                loading="lazy"
	                decoding="async"
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
