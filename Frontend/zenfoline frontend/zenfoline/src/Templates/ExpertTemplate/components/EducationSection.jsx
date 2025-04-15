import React from 'react';
import { formatDate } from '../utils/helpers';
import { FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EducationSection = ({ data, theme }) => {
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

  const dateStyle = {
    color: theme.highlight,
    fontSize: '0.8rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: `${theme.highlight}15`
  };

  const degreeStyle = {
    color: theme.text,
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  };

  const institutionStyle = {
    color: theme.highlight,
    opacity: 0.9,
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const fieldStyle = {
    color: theme.text,
    opacity: 0.8,
    fontSize: '0.95rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  };

  const gpaStyle = {
    color: theme.highlight,
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '0.75rem',
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: `${theme.highlight}15`
  };

  const timelineLineStyle = {
    borderColor: `${theme.highlight}40`,
    opacity: 0.5,
    borderWidth: '2px',
    borderRadius: '9999px'
  };

  const timelineDotStyle = {
    backgroundColor: theme.highlight,
    width: '1rem',
    height: '1rem',
    borderRadius: '9999px',
    position: 'absolute',
    left: '-1.25rem',
    top: '0.35rem',
    boxShadow: `0 0 0 5px ${theme.background}`,
    zIndex: 1
  };

  const achievementTagStyle = {
    display: 'inline-block',
    backgroundColor: `${theme.highlight}15`,
    color: theme.highlight,
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: '500',
    lineHeight: '1.4',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: `${theme.highlight}30`,
      transform: 'translateY(-2px)'
    }
  };

  return (
    <section id="education" className="py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4" 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Education
        </motion.h2>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="absolute left-5 top-[0.35rem] bottom-0 w-px" style={timelineLineStyle}></div>
        
        <div className="space-y-8">
          {data?.map((education, index) => (
            education.isVisible && (
              <motion.div 
                key={index} 
                className="relative pl-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  style={timelineDotStyle}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
                
                <motion.div 
                  style={cardStyle}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={dateStyle}>
                    {formatDate(education.startDate)} - {education.current ? 'Present' : formatDate(education.endDate)}
                  </div>
                  <h3 style={degreeStyle}>{education.degree}</h3>
                  <p style={institutionStyle}>
                    <FaGraduationCap className="w-4 h-4" />
                    {education.institution} {education.location ? `| ${education.location}` : ''}
                  </p>
                  <p style={fieldStyle}>{education.field}</p>
                  {education.gpa && (
                    <p style={gpaStyle}>GPA: {education.gpa}</p>
                  )}
                  
                  {education.achievements && education.achievements.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {education.achievements.map((achievement, idx) => (
                        <motion.span 
                          key={idx} 
                          style={achievementTagStyle}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {achievement}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection; 