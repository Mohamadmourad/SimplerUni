"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  Download,
  School,
  MessageCircle,
  Calendar,
  Trophy,
  ArrowRight,
  Users,
  Menu,
} from "lucide-react";

function Home() {
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
              <span className="ml-2 text-white text-xl font-bold">SimplerUni</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection("home")} className="text-gray-300 hover:text-white">Home</button>
              <button onClick={() => scrollToSection("features")} className="text-gray-300 hover:text-white">Features</button>
              <button onClick={() => scrollToSection("benefits")} className="text-gray-300 hover:text-white">Benefits</button>
              <button onClick={() => scrollToSection("cta")} className="text-gray-300 hover:text-white">Get Started</button>
              <Link href="/login">
              <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                Login
              </button>
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative pt-16">
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* Wrapper div applies opacity */}
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
          <Link href="/request-access">
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

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Essential Tools for University Life
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard icon={<Users className="w-8 h-8 text-purple-600" />} title="Campus Network" description="Build connections with students and faculty securely." />
            <FeatureCard icon={<MessageCircle className="w-8 h-8 text-purple-600" />} title="Seamless Communication" description="Chat, collaborate, and share academic resources easily." />
            <FeatureCard icon={<Calendar className="w-8 h-8 text-purple-600" />} title="Event Updates" description="Stay informed about campus activities and deadlines." />
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="inline-block p-4 rounded-full bg-purple-100 mb-6">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitCard({ title, description }) {
  return (
    <div className="p-8 text-center">
      <h3 className="text-2xl font-semibold text-purple-600 mb-3">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
}

export default Home;
