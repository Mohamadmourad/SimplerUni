"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

import { motion } from "framer-motion";
import {
  Download,
  School,
  MessageCircle,
  Calendar,
  Trophy,
  ArrowRight,
  Users,
  Menu,
  X,
} from "lucide-react";

const universityLogos = [
  "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Lebanese_International_University_%28logo%29.png/250px-Lebanese_International_University_%28logo%29.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/150px-Harvard_University_coat_of_arms.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Cricket_at_University_Parks%2C_Oxford.jpg/200px-Cricket_at_University_Parks%2C_Oxford.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Leland_Stanford_Junior_University.svg/250px-Seal_of_Leland_Stanford_Junior_University.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/150px-Yale_University_Shield_1.svg.png",
];

function BenefitCard({ title, description }) {
  return (
    <div className="p-8 text-center">
      <h3 className="text-2xl font-semibold text-purple-600 mb-3">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
}

function UniversitySlider() {
  return (
    <div className="overflow-hidden py-10 bg-gray-100 flex justify-center">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Universities That Trust Us
        </h2>
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex space-x-12"
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            }}
          >
            {universityLogos.concat(universityLogos).map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="University Logo"
                className="h-24 w-auto object-contain"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false); // Close menu after clicking a link
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <School className="w-8 h-8 text-purple-500" />
              <span className="ml-2 text-white text-xl font-bold">SimplerUni</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection("home")} className="text-gray-300 hover:text-white">Home</button>
              <button onClick={() => scrollToSection("features")} className="text-gray-300 hover:text-white">Features</button>
              <button onClick={() => scrollToSection("benefits")} className="text-gray-300 hover:text-white">Benefits</button>
              <button onClick={() => scrollToSection("cta")} className="text-gray-300 hover:text-white">Get Started</button>
              <Link href="/auth/login">
                <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  Login
                </button>
              </Link>
            </div>
            <div className="md:hidden">
              <button 
                className="text-gray-300 hover:text-white p-2"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                onClick={() => scrollToSection("home")} 
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("features")} 
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("benefits")} 
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Benefits
              </button>
              <button 
                onClick={() => scrollToSection("cta")} 
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Get Started
              </button>
              <Link href="/auth/login" className="block w-full">
                <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-purple-600 text-white hover:bg-purple-700">
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative pt-16">
        <div className="absolute inset-0 w-full h-full bg-black">
          <div className="absolute inset-0 w-full h-full opacity-40">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/University-of-Alabama-EngineeringResearchCenter-01.jpg/1280px-University-of-Alabama-EngineeringResearchCenter-01.jpg"
              alt="University Campus"
              className="w-full h-full object-cover"
              fill
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-48 text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Elevate Your Campus Experience
          </h1>
          <p className="text-xl text-gray-200 max-w-xl mb-10">
            Stay connected, organized, and engaged with everything happening at your university.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/request-access">
              <button className="inline-flex items-center px-8 py-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors text-lg">
                Request Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
            <button className="inline-flex items-center px-8 py-4 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors text-lg">
              <Download className="w-5 h-5 mr-2" />
              Download App
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose SimplerUni?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <BenefitCard title="Better Organization" description="Manage schedules, tasks, and assignments efficiently." />
            <BenefitCard title="Stronger Connections" description="Engage with peers and faculty effortlessly." />
            <BenefitCard title="Enhanced Productivity" description="Access all campus resources in one place." />
          </div>
        </div>
      </div>

      <UniversitySlider />

      {/* CTA Section */}
      <div id="cta" className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h2 className="text-4xl font-bold mb-6">Join the Future of Campus Life</h2>
          <p className="text-gray-300 mb-8 max-w-2xl text-lg">
            Experience a smarter way to stay connected and organized in university.
          </p>
          <button className="inline-flex items-center px-8 py-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors text-lg">
            <Trophy className="w-5 h-5 mr-2" />
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
