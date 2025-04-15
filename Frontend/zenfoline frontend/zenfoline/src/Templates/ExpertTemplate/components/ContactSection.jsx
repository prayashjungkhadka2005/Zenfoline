import React from 'react';
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { expertStyles } from '../styles/expertStyles';
import { getSocialLink } from '../utils/helpers';

const ContactSection = ({ data }) => {
  const basics = data?.basics || {};
  const socialLinks = data?.socialLinks || {};
  
  return (
    <section id="contact" className="py-20 bg-black bg-opacity-50 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Ready to start your next project? Get in touch!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {basics.email && (
            <a
              href={`mailto:${basics.email}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
            >
              <FaEnvelope className="w-5 h-5" />
              Email Me
            </a>
          )}
          
          {getSocialLink('linkedin', socialLinks) && (
            <a
              href={`https://linkedin.com/in/${getSocialLink('linkedin', socialLinks)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              <FaLinkedin className="w-5 h-5" />
              LinkedIn
            </a>
          )}
          
          {getSocialLink('github', socialLinks) && (
            <a
              href={`https://github.com/${getSocialLink('github', socialLinks)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              <FaGithub className="w-5 h-5" />
              GitHub
            </a>
          )}
          
          {basics.phone && (
            <a
              href={`tel:${basics.phone}`}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              <FaPhone className="w-5 h-5" />
              Call Me
            </a>
          )}
          
          {basics.location && (
            <div className="flex items-center justify-center gap-2 text-gray-300 px-6 py-3 col-span-1 sm:col-span-2 lg:col-span-1">
              <FaMapMarkerAlt className="w-5 h-5 text-orange-500" />
              <span className="truncate">{basics.location}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 