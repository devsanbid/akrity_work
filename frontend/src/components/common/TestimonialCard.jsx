import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.location}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex space-x-1">
          {renderStars(testimonial.rating)}
        </div>
        <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
      </div>
      
      <div className="relative mb-4">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-yellow-400 opacity-50" />
        <p className="text-gray-700 leading-relaxed pl-6">
          {testimonial.comment}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
        <span>Books: {testimonial.booksCount}</span>
        <span className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Verified</span>
        </span>
      </div>
    </div>
  );
};

export default TestimonialCard;