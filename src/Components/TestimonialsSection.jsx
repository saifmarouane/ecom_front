import React from 'react';
import { useI18n } from './I18nProvider';

const TestimonialsSection = () => {
  const { t } = useI18n();

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

  return (
    <section className="testimonials">
      <h2>{t('testimonialsTitle')}</h2>
      <div className="testimonials-container">
        <div className="testimonials-scroll">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
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
      </div>
    </section>
  );
};

export default TestimonialsSection;