import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Star, BookOpen, Users, Heart, Award, TrendingUp, Shield, Clock, CheckCircle, Quote } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
      <div className="flex items-center space-x-1 mb-3">
        {renderStars(testimonial.rating)}
      </div>
      <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{testimonial.booksCount} books purchased</span>
        <Quote className="w-4 h-4 text-yellow-400" />
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://i.imgur.com/vCUkaIu.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
    },
    {
      id: 2,
      image: "https://i.imgur.com/mo6Wrf1.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
    },
    {
      id: 3,
      image: "https://i.imgur.com/5vFPJu0.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
    },
    {
      id: 4,
      image: "https://i.imgur.com/l15D65Q.jpeg ?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
    },
    {
      id: 5,
      image: "https://i.imgur.com/g90wKxP.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Anuska Raimaji",
      location: "Kathmandu",
      rating: 5,
      comment: "Amazing platform! Found rare books at incredible prices. The quality was exactly as described.",
      avatar: "https://i.imgur.com/qgFBJEd.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      booksCount: 12
    },
    {
      id: 2,
      name: "Priya Thapa",
      location: "Pokhara",
      rating: 5,
      comment: "Sold my entire collection within a week! Great community of book lovers. Highly recommended.",
      avatar: "https://i.imgur.com/rlFN6fR.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      booksCount: 28
    },
    {
      id: 3,
      name: "Amit Gurung",
      location: "Lalitpur",
      rating: 4,
      comment: "Fast delivery and excellent customer service. The books arrived in perfect condition.",
      avatar: "https://i.imgur.com/qYpBNBl.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      booksCount: 7
    },
    {
      id: 4,
      name: "Sita Poudel",
      location: "Bhaktapur",
      rating: 5,
      comment: "Love the variety of books available. Found textbooks for my studies at half the original price!",
      avatar: "https://i.imgur.com/085lRDr.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      booksCount: 15
    },
    {
      id: 5,
      name: "Binod Rai",
      location: "Chitwan",
      rating: 5,
      comment: "Trustworthy sellers and authentic books. This platform has made reading affordable for everyone.",
      avatar: "https://i.imgur.com/jrP9Llb.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      booksCount: 23
    },
    {
      id: 6,
      name: "Kamala Shrestha",
      location: "Butwal",
      rating: 4,
      comment: "Great experience overall. Easy to use platform with responsive customer support team.",
      avatar: "https://i.imgur.com/7WBwRDH.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      booksCount: 9
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Safe and secure payment processing with buyer protection guarantee."
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Quick delivery across Nepal with real-time tracking and updates."
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "Every book is verified for quality and authenticity before listing."
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive pricing with up to 70% savings on original book prices."
    }
  ];

  const categories = [
    { name: "Academic Books", count: "2,500+", color: "bg-blue-500" },
    { name: "Fiction & Novels", count: "3,200+", color: "bg-purple-500" },
    { name: "Self Help", count: "1,800+", color: "bg-green-500" },
    { name: "Children's Books", count: "1,200+", color: "bg-pink-500" },
    { name: "Comics & Manga", count: "900+", color: "bg-orange-500" },
    { name: "Reference Books", count: "1,500+", color: "bg-indigo-500" }
  ];

  const handleBrowseBooks = () => {
    alert('Browse books functionality would be implemented here');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentSlideData = slides[currentSlide];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Slider Section */}
      <section className="h-screen relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={currentSlideData.image} 
            alt="Background"
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 group"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Main Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Heading */}
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  KitabYatra
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Nepal's Premier Marketplace for Secondhand Books
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for books, authors, genres..."
                  className="w-full pl-14 pr-32 py-4 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg shadow-2xl"
                />
                <button 
                  onClick={handleBrowseBooks}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:scale-105"
                >
                  Browse Books
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-yellow-400 w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 ease-linear"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose KitabYatra?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the best book marketplace with features designed for book lovers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-yellow-500/25">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Discover books across various genres and subjects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-gray-600">{category.count} books available</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating & Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex space-x-1">
                {renderStars(5)}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.8</span>
              <span className="text-gray-600">out of 5 stars</span>
            </div>
            <p className="text-xl text-gray-600">
              Based on 2,500+ reviews from our happy customers
            </p>
          </div>

          {/* Overall Rating Stats */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">4.8/5</div>
                <div className="text-gray-600">Overall Rating</div>
                <div className="flex justify-center space-x-1">
                  {renderStars(5)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">2,500+</div>
                <div className="text-gray-600">Total Reviews</div>
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">Growing</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
                <div className="flex items-center justify-center space-x-1">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-medium">Loved</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">15K+</div>
                <div className="text-gray-600">Happy Customers</div>
                <div className="flex items-center justify-center space-x-1">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-600 font-medium">Community</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Book Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of book lovers who have already discovered their next favorite read
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Browse Books Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;