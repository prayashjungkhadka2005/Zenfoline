import React from 'react';
import { FaLink } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';

const PublicationsSection = ({ data, theme }) => {
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

  const pubTitleStyle = {
    color: theme.text,
    fontWeight: 600
  };

  const publisherStyle = {
    color: theme.secondary,
    fontSize: '0.9rem'
  };

  const descriptionStyle = {
    color: theme.text,
    opacity: 0.85,
    fontSize: '0.9rem',
    lineHeight: '1.6'
  };

  const linkStyle = {
    color: theme.highlight,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.9rem',
    transition: 'color 0.3s',
    fontWeight: 500
  };

  const handleLinkHover = (e, isHover) => {
    e.target.style.color = isHover ? theme.secondary : theme.highlight;
  };

  return (
    <section id="publications" className="py-8 md:py-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={titleStyle}>Publications</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        {data?.map((pub, index) => (
          <div 
            key={index} 
            style={cardStyle} 
            className="flex-grow flex-shrink-0 basis-[400px] max-w-full flex flex-col"
          >
            {pub.image && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={pub.image} 
                  alt={pub.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=Publication+Image';
                  }}
                />
              </div>
            )}
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold mb-2" style={pubTitleStyle}>{pub.title}</h3>
              <p className="mb-3" style={publisherStyle}>
                {pub.publisher} - {formatDate(pub.date || pub.publicationDate)}
              </p>
              <p className="mb-4 flex-grow" style={descriptionStyle}>{pub.description}</p>
              {pub.url && (
                <div className="mt-auto pt-3 border-t border-gray-700/50">
                  <a 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={linkStyle}
                    onMouseOver={(e) => handleLinkHover(e, true)}
                    onMouseOut={(e) => handleLinkHover(e, false)}
                  >
                    <FaLink /> Read More
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublicationsSection; 