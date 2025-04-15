import React from 'react';
import { FaAward } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';

const AwardsSection = ({ data, theme }) => {
  const titleStyle = {
    color: theme.highlight
  };

  const cardStyle = {
    backgroundColor: theme.primary,
    opacity: 0.95,
    borderRadius: '0.75rem',
    boxShadow: '0 6px 12px -3px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const awardTitleStyle = {
    color: theme.text,
    fontWeight: 600
  };

  const issuerStyle = {
    color: theme.secondary,
    fontSize: '0.9rem'
  };

  const descriptionStyle = {
    color: theme.text,
    opacity: 0.85,
    fontSize: '0.9rem',
    lineHeight: '1.6'
  };

  return (
    <section id="awards" className="py-8 md:py-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={titleStyle}>Awards & Recognition</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        {data?.map((award, index) => (
          <div 
            key={index} 
            style={cardStyle} 
            className="flex-grow flex-shrink-0 basis-[400px] max-w-full flex flex-col"
          >
            {award.image && (
              <div className="w-full h-64 overflow-hidden">
                <img 
                  src={award.image} 
                  alt={award.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=Award+Image';
                  }}
                />
              </div>
            )}
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <FaAward className="text-yellow-500" />
                <h3 className="text-xl font-semibold" style={awardTitleStyle}>{award.title}</h3>
              </div>
              <p className="mb-3" style={issuerStyle}>
                {award.issuer} - {formatDate(award.date)}
              </p>
              <p className="mb-4 flex-grow" style={descriptionStyle}>{award.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection; 