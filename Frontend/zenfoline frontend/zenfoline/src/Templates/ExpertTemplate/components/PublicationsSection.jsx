import React from 'react';
import { FaLink } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

const PublicationsSection = ({ data, theme }) => {
  const titleStyle = {
    color: theme.highlight
  };

  const cardStyle = {
    backgroundColor: `${theme.primary}80`,
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    boxShadow: `0 10px 30px ${theme.primary}20`,
    border: `1px solid ${theme.highlight}20`,
    transition: 'all 0.3s ease',
    cursor: 'default',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: `0 15px 35px ${theme.primary}30`,
      border: `1px solid ${theme.highlight}40`,
    }
  };

  const pubTitleStyle = {
    color: theme.text,
    fontWeight: 600
  };

  const publisherStyle = {
    color: theme.highlight,
    fontSize: '0.9rem',
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: `${theme.highlight}15`
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
    gap: '0.5rem',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    backgroundColor: `${theme.highlight}15`,
    ':hover': {
      backgroundColor: `${theme.highlight}30`,
      transform: 'translateY(-2px)'
    }
  };

  const fallbackImageUrl = 'https://placehold.co/400x200/png?text=Publication+Image';
  // or alternatively: 'https://picsum.photos/400/200'

  return (
    <section id="publications" className="py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4" 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Publications
        </motion.h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        {data?.map((pub, index) => (
          <motion.div 
            key={index} 
            style={cardStyle} 
            className="flex-grow flex-shrink-0 basis-[400px] max-w-full flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {pub.image && (
              <motion.div 
                className="w-full h-64 overflow-hidden rounded-t-[1rem]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={pub.image} 
                  alt={pub.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = fallbackImageUrl;
                  }}
                />
              </motion.div>
            )}
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold mb-2" style={pubTitleStyle}>{pub.title}</h3>
              <p className="mb-3" style={publisherStyle}>
                {pub.publisher} - {formatDate(pub.date || pub.publicationDate)}
              </p>
              <p className="mb-4 flex-grow" style={descriptionStyle}>{pub.description}</p>
              {pub.url && (
                <div className="mt-auto pt-3 border-t border-gray-700/50">
                  <motion.a 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={linkStyle}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaLink className="w-4 h-4" /> Read More
                  </motion.a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PublicationsSection; 