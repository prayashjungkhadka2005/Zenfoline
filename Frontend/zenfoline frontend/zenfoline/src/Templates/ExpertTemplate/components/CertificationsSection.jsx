import React from 'react';
import { formatDate } from '../utils/helpers';
import { FaLink, FaCertificate } from 'react-icons/fa';

// Accept theme prop
const CertificationsSection = ({ data, theme }) => {
  const titleStyle = {
    color: theme.highlight
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const cardStyle = {
    backgroundColor: theme.primary,
    opacity: 0.95,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 6px 12px -3px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column'
  };

  const certTitleStyle = {
    color: theme.text,
    fontWeight: 600
  };

  const issuerStyle = {
    color: theme.secondary,
    fontSize: '0.9rem'
  };

  const dateTextStyle = {
    ...issuerStyle,
    opacity: 0.8,
    fontSize: '0.8rem'
  };

  const linkStyle = {
    color: theme.highlight,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'color 0.3s',
    fontWeight: 500
  };

  const handleLinkHover = (e, isHover) => {
    e.target.style.color = isHover ? theme.secondary : theme.highlight;
  };

  return (
    <section id="certifications" className="py-8 md:py-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={titleStyle}>Certifications</h2>
        {/* Optional Subtitle */}
        {/* <p className={`text-lg md:text-xl ${textColor} max-w-3xl mx-auto`}>My credentials and qualifications.</p> */}
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        {data?.map((cert, index) => (
          <div 
            key={index} 
            className="flex-grow flex-shrink-0 basis-[300px] max-w-full flex flex-col"
            style={cardStyle}
          >
            <div className="flex items-start mb-3">
              <FaCertificate className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{color: theme.highlight}} />
              <h3 className="text-lg font-semibold flex-1" style={certTitleStyle}>{cert.name}</h3>
            </div>
            <p className="text-sm mb-1" style={issuerStyle}>Issued by: {cert.issuer}</p>
            <p className="mb-3" style={dateTextStyle}>
              Issued: {formatDate(cert.issueDate)}
              {cert.expiryDate && ` - Expires: ${formatDate(cert.expiryDate)}`}
            </p>
            {cert.credentialId && (
              <p className="text-xs mb-1" style={{ ...textStyle, opacity: 0.7 }}>ID: {cert.credentialId}</p>
            )}
            {cert.credentialUrl && (
              <div className="mt-auto pt-3 border-t border-gray-700/50">
                <a 
                  href={cert.credentialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm"
                  style={linkStyle}
                  onMouseOver={(e) => handleLinkHover(e, true)}
                  onMouseOut={(e) => handleLinkHover(e, false)}
                >
                  <FaLink /> View Credential
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificationsSection; 