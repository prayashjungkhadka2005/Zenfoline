import React from 'react';
import { FaCode, FaPaintBrush, FaBullhorn, FaCheck } from 'react-icons/fa'; // Added FaCheck

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
    backgroundColor: theme.primary,
    opacity: 0.95, // Slightly increase opacity
    borderRadius: '0.75rem', // Increase radius slightly
    overflow: 'hidden',
    boxShadow: '0 6px 12px -3px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06)', // Enhanced shadow
    display: 'flex',
    flexDirection: 'column'
  };

  const cardTextStyle = {
    color: theme.text,
    opacity: 0.85 // Slightly less opaque
  };
  
  const serviceTitleStyle = {
      color: theme.text, // Keep text color for title
      fontWeight: 700, // Bolder
      fontSize: '1.25rem' // Larger title
  };

  const descriptionStyle = {
    ...cardTextStyle, // Inherit base style
    fontSize: '0.95rem', // Slightly larger description
    lineHeight: '1.6'
  };

  const priceStyle = {
    color: theme.highlight,
    fontWeight: 700, // Bolder
    fontSize: '1.1rem' // Larger price
  };

  const iconContainerStyle = {
    backgroundColor: `${theme.highlight}1A`,
    padding: '0.5rem', // Reduced padding
    borderRadius: '0.375rem' // Slightly smaller radius to match
  };

  const iconStyle = {
    color: theme.highlight,
    width: '1.1rem', // Reduced width
    height: '1.1rem' // Reduced height
  };

  // Removed bulletStyle, will use icons
  const featuresListStyle = {
      listStyle: 'none', 
      padding: 0
  };
  
  const featureItemStyle = {
      ...cardTextStyle, // Inherit base style
      fontSize: '0.9rem', // Consistent small font
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem'
  };
  
  const featureIconStyle = {
      color: theme.highlight,
      marginTop: '0.25em', // Align icon slightly better with text
      flexShrink: 0 // Prevent icon shrinking
  };

  return (
    <section id="services" className="py-8 md:py-12" style={{ backgroundColor: theme.background }}>
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={titleStyle}>Services</h2>
        {/* Optional Subtitle */}
        {/* <p className={`text-lg md:text-xl ${textColor} max-w-3xl mx-auto`}>How I can help you achieve your goals.</p> */}
      </div>

      {/* Using flex-grow and basis for flexible item sizing */}
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4"> {/* Added px-4 */}
        {data?.map((service, index) => (
          service.isVisible && (
            // Removed fixed widths, added flex-grow and basis
            <div 
              key={index} 
              style={cardStyle} 
              className="flex-grow flex-shrink-0 basis-[350px] max-w-full flex flex-col" // Ensure flex column
            >
              {/* Service Image */}
              {service.image && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Service+Image';
                    }}
                  />
                </div>
              )}
              
              {/* Card Content Area */}
              <div className="p-6 flex flex-col flex-grow"> {/* Ensure flex column and growth */}
                {/* Top Section: Icon, Title, Price */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div style={iconContainerStyle}>
                      {/* You might want dynamic icons based on service title/type */}
                      <FaCode style={iconStyle} /> 
                    </div>
                    <h3 style={serviceTitleStyle}>{service.title}</h3>
                  </div>
                  {service.price && (
                    <div style={priceStyle} className="flex-shrink-0 ml-4">
                      {service.price}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p style={descriptionStyle} className="mb-5"> {/* Added more bottom margin */}
                  {service.description}
                </p>

                {/* Features List - Placed at the bottom */}
                {service.features && service.features.length > 0 && (
                  <div className="mt-auto pt-4 border-t border-gray-700/50"> {/* Use mt-auto to push to bottom */}
                    <h4 style={{...cardTextStyle, fontWeight: 600, marginBottom: '0.75rem'}}>Key Features:</h4>
                    <ul style={featuresListStyle} className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} style={featureItemStyle}>
                          <FaCheck size="0.8em" style={featureIconStyle} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
};

export default ServicesSection; 