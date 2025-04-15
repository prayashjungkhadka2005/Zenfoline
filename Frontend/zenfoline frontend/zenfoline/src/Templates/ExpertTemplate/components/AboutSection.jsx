import React from 'react';

// Accept theme prop
const AboutSection = ({ data, theme }) => {
  const sectionStyle = {
    position: 'relative',
    backgroundColor: `${theme.primary}33`, // Increased opacity to ~20% (from 1A)
    color: theme.text,
    width: '100%',
    overflow: 'hidden'
  };

  const containerStyle = {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '4rem 1rem',
    position: 'relative',
    textAlign: 'center'
  };

  const titleStyle = {
    color: theme.highlight,
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  };

  const titleUnderlineStyle = {
    display: 'block',
    width: '60px',
    height: '4px',
    backgroundColor: theme.highlight,
    margin: '0.5rem auto 2rem',
    borderRadius: '2px'
  };

  const contentTextStyle = {
    color: theme.text,
    fontSize: '1.15rem', // Slightly larger font size
    lineHeight: '1.8', // Adjusted line height
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '400',
    marginBottom: '1.5rem' // Keep default margin between paragraphs
  };

  const highlightTagStyle = {
    display: 'inline-block',
    backgroundColor: `${theme.highlight}2A`, // Slightly more opaque tag background
    color: theme.highlight,
    padding: '0.3rem 0.8rem',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    lineHeight: '1.4',
    margin: '0.25rem' 
  };

  return (
    <section id="about" style={sectionStyle} className="py-8 md:py-12">
      <div style={containerStyle}>
        <h2 style={titleStyle}>
          About Me
        </h2>
        <div style={titleUnderlineStyle}></div>

        <div>
          {data?.description && (
            <p style={contentTextStyle}>
              {data.description}
            </p>
          )}

          {data?.vision && (
            <p style={{ ...contentTextStyle, fontStyle: 'italic', opacity: 0.8, marginBottom: '2.5rem' }}>
              {data.vision}
            </p>
          )}

          {data?.highlights && data.highlights.filter(h => h.isVisible).length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-700/30"> 
              {data.highlights.map((highlight, index) => (
                highlight.isVisible && (
                  <span key={index} style={highlightTagStyle}>
                    {highlight.text}
                  </span>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 