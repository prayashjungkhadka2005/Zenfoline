import React from 'react';
import { FaCode, FaPaintBrush, FaBullhorn, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Map service titles or types to icons (customize as needed)
const serviceIcons = {
  default: FaCode,
  webdevelopment: FaCode,
  design: FaPaintBrush,
  marketing: FaBullhorn,
  // Add more specific mappings
};

// Accept theme prop
const ServicesSection = ({ data, theme }) => {
  const titleStyle = {
    color: theme.highlight
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const cardStyle = {
    backgroundColor: `${theme.primary}80`,
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    overflow: 'hidden',
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

  const cardTextStyle = {
    color: theme.text,
    opacity: 0.85
  };
  
  const serviceTitleStyle = {
    color: theme.text,
    fontWeight: 600,
    fontSize: '1.25rem'
  };

  const descriptionStyle = {
    ...cardTextStyle,
    fontSize: '0.95rem',
    lineHeight: '1.6'
  };

  const priceStyle = {
    color: theme.highlight,
    fontWeight: 600,
    fontSize: '1.1rem',
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: `${theme.highlight}15`
  };

  const iconContainerStyle = {
    backgroundColor: `${theme.highlight}15`,
    padding: '0.75rem',
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: `${theme.highlight}30`,
      transform: 'scale(1.1)'
    }
  };

  const iconStyle = {
    color: theme.highlight,
    width: '1.25rem',
    height: '1.25rem'
  };

  const featuresListStyle = {
    listStyle: 'none', 
    padding: 0
  };
  
  const featureItemStyle = {
    ...cardTextStyle,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem'
  };
  
  const featureIconStyle = {
    color: theme.highlight,
    marginTop: '0.25em',
    flexShrink: 0
  };

  return (
    <section id="services" className="py-12 md:py-16" style={{ backgroundColor: theme.background }}>
      <div className="text-center mb-12 md:mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4" 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Services
        </motion.h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        {data?.map((service, index) => (
          service.isVisible && (
            <motion.div 
              key={index} 
              style={cardStyle} 
              className="flex-grow flex-shrink-0 basis-[350px] max-w-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {service.image && (
                <motion.div 
                  className="w-full h-64 overflow-hidden rounded-t-[1rem]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Service+Image';
                    }}
                  />
                </motion.div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      style={iconContainerStyle}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {React.createElement(serviceIcons[service.type] || serviceIcons.default, { style: iconStyle })}
                    </motion.div>
                    <h3 style={serviceTitleStyle}>{service.title}</h3>
                  </div>
                  {service.price && (
                    <motion.div 
                      style={priceStyle}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service.price}
                    </motion.div>
                  )}
                </div>

                <p style={descriptionStyle} className="mb-5">
                  {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <div className="mt-auto pt-4 border-t border-gray-700/50">
                    <h4 style={{...cardTextStyle, fontWeight: 600, marginBottom: '0.75rem'}}>Key Features:</h4>
                    <ul style={featuresListStyle} className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <motion.li 
                          key={fIndex} 
                          style={featureItemStyle}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: fIndex * 0.1 }}
                        >
                          <FaCheck size="0.8em" style={featureIconStyle} />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )
        ))}
      </div>
    </section>
  );
};

export default ServicesSection; 