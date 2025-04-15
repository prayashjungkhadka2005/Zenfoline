import React from 'react';
import { formatDate } from '../utils/helpers';
import { FaLink, FaCertificate } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
    backgroundColor: `${theme.primary}80`,
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    padding: '1.5rem',
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

  const certTitleStyle = {
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

  const dateTextStyle = {
    color: theme.text,
    opacity: 0.8,
    fontSize: '0.8rem',
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: `${theme.primary}40`
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

  return (
    <section id="certifications" className="py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4" 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Certifications
        </motion.h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        {data?.map((cert, index) => (
          <motion.div 
            key={index} 
            className="flex-grow flex-shrink-0 basis-[300px] max-w-full flex flex-col"
            style={cardStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start mb-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <FaCertificate className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{color: theme.highlight}} />
              </motion.div>
              <h3 className="text-lg font-semibold flex-1" style={certTitleStyle}>{cert.name}</h3>
            </div>
            <p className="text-sm mb-2" style={issuerStyle}>Issued by: {cert.issuer}</p>
            <p className="mb-3" style={dateTextStyle}>
              Issued: {formatDate(cert.issueDate)}
              {cert.expiryDate && ` - Expires: ${formatDate(cert.expiryDate)}`}
            </p>
            {cert.credentialId && (
              <p className="text-xs mb-2" style={{ ...textStyle, opacity: 0.7 }}>
                ID: {cert.credentialId}
              </p>
            )}
            {cert.credentialUrl && (
              <div className="mt-auto pt-3 border-t border-gray-700/50">
                <motion.a 
                  href={cert.credentialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm"
                  style={linkStyle}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaLink className="w-4 h-4" /> View Credential
                </motion.a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CertificationsSection; 