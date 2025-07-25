import React from 'react';
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { BookOpen, Users, Heart, Award, Target, Globe, CheckCircle, Star } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { icon: BookOpen, number: '15K+', label: 'Books Available' },
    { icon: Users, number: '8K+', label: 'Happy Readers' },
    { icon: Globe, number: '500+', label: 'Cities Covered' },
    { icon: Award, number: '99%', label: 'Customer Satisfaction' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We believe in building a strong community of book lovers who share knowledge and stories.'
    },
    {
      icon: Target,
      title: 'Accessibility',
      description: 'Making quality books affordable and accessible to everyone across Nepal.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Promoting book reuse and recycling to create a more sustainable reading culture.'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Every book is carefully verified to ensure the best reading experience for our users.'
    }
  ];

  const team = [
    {
      name: 'Aakriti Rasaili',
      role: 'Chief Executive Officer',
      description: 'Visionary leader with 12+ years in tech and e-commerce. Passionate about democratizing access to knowledge through affordable books.',
      image: 'https://i.imgur.com/VeKz25x.jpeg'
    },
    {
      name: 'Utshav Gopali',
      role: 'Chief Technology Officer',
      description: 'Full-stack developer and tech architect with expertise in scalable marketplace platforms and user experience design.',
      image: 'https://i.imgur.com/Qe8tcrK.jpeg?auto=compress&cs=tinysrgb&w=300&h=300'
    },
    {
      name: 'Ukesh Mahara',
      role: 'Head of Operations',
      description: 'Operations expert specializing in logistics, supply chain management, and ensuring seamless book delivery across Nepal.',
      image: 'https://i.imgur.com/Ak61Xnn.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Sony Adhikari',
      role: 'Marketing Director',
      description: 'Creative marketing strategist with deep understanding of Nepali reading culture and community engagement.',
      image: 'https://i.imgur.com/z3KvMmb.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Rojan Shrestha',
      role: 'Customer Success Manager',
      description: 'Dedicated to ensuring exceptional customer experience and building lasting relationships with our book community.',
      image: 'https://i.imgur.com/eMTNUQc.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6">
            About
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              KitabYatra
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make quality books accessible to everyone in Nepal. 
            Join our community of book lovers and discover your next great read.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  KitabYatra was born from a simple observation: too many great books were sitting unused on shelves 
                  while eager readers couldn't afford new ones. We saw an opportunity to bridge this gap and create 
                  a thriving community of book lovers.
                </p>
                <p>
                  Founded in 2023, we started as a small initiative in Kathmandu and have grown to serve readers 
                  across Nepal. Our platform connects book sellers with buyers, making quality literature accessible 
                  and affordable for everyone.
                </p>
                <p>
                  Today, we're proud to be Nepal's leading marketplace for secondhand books, fostering a culture 
                  of reading, sharing, and sustainable consumption.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop" 
                alt="Books and reading" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-black p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Trusted by thousands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              The principles that guide everything we do at KitabYatra
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              The passionate people behind KitabYatra's success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-1">{member.name}</h3>
                  <p className="text-yellow-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Book Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of book lovers who have already discovered their next favorite read on KitabYatra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Browse Books
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;