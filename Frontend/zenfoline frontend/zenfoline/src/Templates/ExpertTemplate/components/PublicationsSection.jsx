import React from 'react';
import { FaLink } from 'react-icons/fa';
import { expertStyles } from '../styles/expertStyles';
import { formatDate } from '../utils/helpers';

const PublicationsSection = ({ data }) => {
  return (
    <section id="publications" className="py-20 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">Publications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {data.publications.map((publication, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={publication.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt={publication.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{publication.title}</h3>
                <p className="text-gray-400 mb-2">{publication.publisher}</p>
                <p className="text-gray-400 mb-6">{formatDate(publication.date)}</p>
                <p className="text-gray-300 mb-6 line-clamp-3">{publication.description}</p>
                {publication.url && (
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                  >
                    <FaLink className="w-5 h-5" />
                    Read Publication
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsSection; 