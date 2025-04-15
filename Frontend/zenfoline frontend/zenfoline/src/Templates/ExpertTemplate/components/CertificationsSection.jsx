import React from 'react';
import { FaLink } from 'react-icons/fa';
import { expertStyles } from '../styles/expertStyles';
import { formatDate } from '../utils/helpers';

const CertificationsSection = ({ data }) => {
  return (
    <section id="certifications" className="py-20 bg-black bg-opacity-50 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {data.certifications.map((certification, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{certification.name}</h3>
                <p className="text-gray-400 mb-2">{certification.issuer}</p>
                <div className="flex gap-4 mb-4">
                  <p className="text-gray-400">Issued: {formatDate(certification.issueDate)}</p>
                  {certification.expiryDate && (
                    <p className="text-gray-400">Expires: {formatDate(certification.expiryDate)}</p>
                  )}
                </div>
                <p className="text-gray-300 mb-6">{certification.description}</p>
                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                  >
                    <FaLink className="w-5 h-5" />
                    View Credential
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

export default CertificationsSection; 