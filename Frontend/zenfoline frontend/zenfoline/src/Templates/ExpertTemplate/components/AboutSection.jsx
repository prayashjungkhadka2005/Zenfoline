import React from 'react';
import { FiCode } from 'react-icons/fi';
import { expertStyles } from '../styles/expertStyles';

const AboutSection = ({ data }) => {
  return (
    <section id="about" className="py-20 bg-black bg-opacity-50 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-300 mb-8">{data.about.description}</p>
          
          {/* Vision Statement Display */}
          {data.about.vision && (
            <div className="mb-8 border-l-4 border-orange-500 pl-4 italic">
              <h4 className="text-xl font-semibold mb-2 text-orange-500">My Vision</h4>
              <p className="text-lg text-gray-300">{data.about.vision}</p>
            </div>
          )}

          {data.about.highlights?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.about.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg">
                  <FiCode className="text-orange-500 w-5 h-5" />
                  <span className="text-gray-300">{highlight.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 