import React from 'react';
import Navbar from "../components/common/Navbar.jsx";
import HeroSection from "../components/common/HeroSection.jsx";
import Footer from "../components/common/Footer.jsx";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default HomePage;