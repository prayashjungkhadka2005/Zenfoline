import React, { useState } from 'react';
import { FiCheckCircle, FiUser, FiLayout, FiBarChart2, FiZap, FiArrowRight, FiEdit, FiEye, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ScrollProgressBar from './ScrollProgressBar';

const features = [
  {
    icon: <FiLayout className="w-8 h-8 text-orange-500" />, title: "Stunning Templates",
    desc: "Choose from beautiful, responsive portfolio templates and make your brand stand out."
  },
  {
    icon: <FiUser className="w-8 h-8 text-blue-500" />, title: "Easy Customization",
    desc: "Edit your portfolio sections in real time with an intuitive editor. No coding required—just simple, fast customization."
  },
  {
    icon: <FiBarChart2 className="w-8 h-8 text-green-500" />, title: "Built-in Analytics",
    desc: "Track your visitors, views, and engagement with powerful analytics."
  },
  {
    icon: <FiZap className="w-8 h-8 text-purple-500" />, title: "Instant Preview",
    desc: "See your changes live as you build. What you see is what you get."
  }
];

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <ScrollProgressBar />
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 min-h-screen flex flex-col justify-center items-center text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 animate-slide-up">
          Build Your <span className="text-orange-500 hover:text-orange-600 transition-colors duration-300">Dream Portfolio</span> in Minutes
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-slide-up-delay">
          Zenfoline lets you create a stunning, professional portfolio with zero coding.<br />
          Choose a template, customize your sections, and launch your brand today.
        </p>
        <Link to="/signup" className="animate-slide-up-delay-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg flex items-center gap-2 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
            Get Started Free <FiArrowRight className="w-5 h-5 animate-bounce-x" />
          </button>
        </Link>
        <p className="text-sm text-gray-400 mt-3 animate-fade-in-delay">No credit card required</p>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 bg-gradient-to-br from-white via-orange-50 to-white rounded-2xl shadow mt-[120px] transform hover:shadow-lg transition-all duration-300">
        {features.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl hover:bg-orange-50/60 transition-all duration-300 group w-full animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
            {React.cloneElement(f.icon, { className: 'w-12 h-12 mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ' + f.icon.props.className })}
            <h3 className="mt-6 text-2xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors duration-300">{f.title}</h3>
            <p className="mt-3 text-lg text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow mt-[120px] transform hover:shadow-lg transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center mt-6"><span className="text-blue-500 hover:text-blue-600 transition-colors duration-300">How Zenfoline Works</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {[
            {
              number: 1,
              title: "Sign Up",
              description: "Create your free account in seconds.",
              color: "text-orange-500"
            },
            {
              number: 2,
              title: "Choose & Customize",
              description: "Pick a template, add your info, and personalize your sections.",
              color: "text-blue-500"
            },
            {
              number: 3,
              title: "Go Live",
              description: "Publish your portfolio and share your unique link with the world.",
              color: "text-green-500"
            }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 w-full hover:shadow-2xl hover:bg-blue-50/60 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
                <span className={`text-3xl font-bold ${step.color}`}>{step.number}</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h4>
              <p className="text-lg text-gray-500 text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Preview / Demo */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center bg-gradient-to-br from-white via-purple-50 to-white rounded-2xl shadow mt-[120px] transform hover:shadow-lg transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center"><span className="text-purple-500 hover:text-purple-600 transition-colors duration-300">See Zenfoline in Action</span></h2>
        <div className="w-full flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white max-w-7xl w-full hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center p-8 gap-8">
              <div className="flex-1 flex flex-col gap-4">
                {[
                  { icon: <FiEdit className="w-6 h-6 text-orange-500" />, text: "Real-time Editor" },
                  { icon: <FiEye className="w-6 h-6 text-blue-500" />, text: "Live Preview" },
                  { icon: <FiCheckCircle className="w-6 h-6 text-green-500" />, text: "Easy Section Management" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 animate-fade-in-left" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="transform transition-transform duration-300 hover:scale-110">{item.icon}</div>
                    <span className="font-semibold text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <img src="/land.png" alt="Portfolio Preview" className="rounded-xl shadow-lg w-full max-w-lg object-cover object-top md:max-w-2xl h-48 md:h-64 transform hover:scale-105 hover:shadow-2xl transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center bg-gradient-to-br from-white via-orange-50 to-white rounded-2xl shadow mt-[120px] mb-[60px] transform hover:shadow-lg transition-all duration-300">
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center w-full">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 animate-fade-in"><span className="text-orange-500 hover:text-orange-600 transition-colors duration-300">Ready to stand out?</span></h2>
          <p className="text-gray-600 mb-8 text-lg animate-fade-in-delay">Join hundreds of creators, professionals, and students using Zenfoline to showcase their work and grow their brand.</p>
          <Link to="/signup">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg text-xl font-semibold shadow-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:translate-y-[-2px] animate-bounce-subtle">
              Start Your Free Portfolio <FiArrowRight className="w-5 h-5 animate-bounce-x" />
            </button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-white via-orange-50 to-white rounded-2xl shadow mt-[120px] mb-[60px] transform hover:shadow-lg transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center"><span className="text-orange-500 hover:text-orange-600 transition-colors duration-300">Frequently Asked Questions</span></h2>
        <div className="space-y-4">
          {[
            {
              question: "Do I need coding experience to use Zenfoline?",
              answer: "No coding experience required! Zenfoline is designed to be user-friendly with a simple drag-and-drop interface. Anyone can create a professional portfolio in minutes."
            },
            {
              question: "Can I customize my portfolio's design?",
              answer: "Yes! You can choose from various templates and customize colors, fonts, layouts, and content to match your personal brand."
            },
            {
              question: "Is my portfolio mobile-friendly?",
              answer: "Absolutely! All Zenfoline portfolios are fully responsive and look great on any device - from desktop to mobile phones."
            },
            {
              question: "How do I update my portfolio after publishing?",
              answer: "You can edit your portfolio anytime through our intuitive dashboard. Changes are saved automatically and can be published with a single click."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in-up hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>
              <button
                onClick={() => {
                  const element = document.getElementById(`faq-${i}`);
                  const isOpen = element.style.maxHeight;
                  element.style.maxHeight = isOpen ? null : `${element.scrollHeight}px`;
                  const icon = document.getElementById(`icon-${i}`);
                  icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                }}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-orange-50 transition-colors duration-300"
              >
                <h3 className="text-lg font-medium text-gray-800 group-hover:text-orange-500">{faq.question}</h3>
                <FiChevronDown
                  id={`icon-${i}`}
                  className="w-5 h-5 text-orange-500 transition-transform duration-300"
                />
              </button>
              <div
                id={`faq-${i}`}
                className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out"
              >
                <div className="px-6 py-4 text-base text-gray-600 border-t border-orange-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-6 mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Zenfoline. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in-left {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
      `}</style>
    </div>
  );
} 