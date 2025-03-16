"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  School,
  Users,
  MessageCircle,
  Calendar,
  Trophy,
  ArrowRight,
  Menu,
} from "lucide-react";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&h=1080&auto=format&fit=crop&q=80",
      title: "Connect Your Campus Community",
      subtitle:
        "The ultimate social platform designed exclusively for university students and faculty.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=1080&auto=format&fit=crop&q=80",
      title: "Learn Together, Grow Together",
      subtitle:
        "Join study groups, share resources, and collaborate on projects with peers.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&h=1080&auto=format&fit=crop&q=80",
      title: "Campus Life Simplified",
      subtitle:
        "Stay connected with events, clubs, and campus activities all in one place.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <School className="w-8 h-8 text-purple-500" />
              <span className="ml-2 text-white text-xl font-bold">
                SimplerUni
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("stats")}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                Stats
              </button>
              <button
                onClick={() => scrollToSection("cta")}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                Get Started
              </button>
              <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer">
                Login
              </button>
            </div>

            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white cursor-pointer">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative pt-16">
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-48">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 transition-opacity duration-500">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10 transition-opacity duration-500">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors text-lg cursor-pointer">
                Request Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors text-lg cursor-pointer">
                <Download className="w-5 h-5 mr-2" />
                Download App
              </button>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                    currentSlide === index
                      ? "bg-purple-500"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Everything You Need to Succeed
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Users className="w-8 h-8 text-purple-600" />}
              title="Campus Network"
              description="Connect with students and faculty across your university in a secure, verified environment."
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8 text-purple-600" />}
              title="Seamless Communication"
              description="Real-time messaging, group discussions, and academic collaboration tools."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-purple-600" />}
              title="Campus Life"
              description="Stay updated with events, deadlines, and important university announcements."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard number="100+" text="Partner Universities" />
            <StatCard number="500K+" text="Active Users" />
            <StatCard number="5M+" text="Daily Interactions" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="cta" className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Academic Revolution</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Transform your university experience with SimplerUni. Connect, collaborate, and succeed together.
          </p>
          <button className="inline-flex items-center px-8 py-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors text-lg">
            <Trophy className="w-5 h-5 mr-2" />
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="inline-block p-4 rounded-full bg-purple-100 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, text }) {
  return (
    <div className="p-8">
      <div className="text-5xl font-bold text-purple-600 mb-3">{number}</div>
      <div className="text-gray-600 text-lg">{text}</div>
    </div>
  );
}

export default Home;