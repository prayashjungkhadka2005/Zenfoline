import React from 'react';
import { expertStyles } from '../styles/expertStyles';
import { getIconComponent } from '../utils/icons';

const ServicesSection = ({ data }) => {
  return (
    <section id="services" className="py-20 bg-black bg-opacity-50 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.services?.map((service, index) => (
            <div key={index} className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="p-6">
                <div className="text-orange-500 mb-4">
                  {service.icon && getIconComponent(service.icon)({ className: "w-8 h-8" })}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 