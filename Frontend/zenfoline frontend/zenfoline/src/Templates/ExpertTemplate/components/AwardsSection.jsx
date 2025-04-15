import React from 'react';
import { FaAward } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

const AwardsSection = ({ data, theme }) => {
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

  const awardTitleStyle = {
    color: theme.text,
    fontWeight: 600
  };

  const issuerStyle = {
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

  const awardIconStyle = {
    color: theme.highlight,
    width: '1.5rem',
    height: '1.5rem',
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
  };

  return (
    <section id="awards" className="py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4" 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Awards & Recognition
        </motion.h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        {data?.map((award, index) => (
          <motion.div 
            key={index} 
            style={cardStyle} 
            className="flex-grow flex-shrink-0 basis-[400px] max-w-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {award.image && (
              <motion.div 
                className="w-full h-64 overflow-hidden rounded-t-[1rem]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={award.image} 
                  alt={award.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=Award+Image';
                  }}
                />
              </motion.div>
            )}
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaAward style={awardIconStyle} />
                </motion.div>
                <h3 className="text-xl font-semibold" style={awardTitleStyle}>{award.title}</h3>
              </div>
              <p className="mb-3" style={issuerStyle}>
                {award.issuer} - {formatDate(award.date)}
              </p>
              <p className="mb-4 flex-grow" style={descriptionStyle}>{award.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection; 