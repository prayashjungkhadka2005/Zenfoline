import React from 'react';
import { formatDate } from '../utils/helpers';
import { FaGraduationCap } from 'react-icons/fa';

const EducationSection = ({ data, theme }) => {
  const titleStyle = {
    color: theme.highlight
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const cardStyle = {
    backgroundColor: `${theme.primary}1A`,
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: `1px solid ${theme.primary}40`
  };

  const dateStyle = {
    color: theme.secondary,
    fontSize: '0.8rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  };

  const degreeStyle = {
    color: theme.highlight,
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  };

  const institutionStyle = {
    color: theme.text,
    opacity: 0.85,
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '0.75rem'
  };

  const fieldStyle = {
    color: theme.text,
    opacity: 0.8,
    fontSize: '0.95rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  };

  const gpaStyle = {
    color: theme.secondary,
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '0.75rem'
  };

  const timelineLineStyle = {
    borderColor: theme.highlight,
    opacity: 0.3,
    borderWidth: '1px'
  };

  const timelineDotStyle = {
    backgroundColor: theme.highlight,
    width: '1rem',
    height: '1rem',
    borderRadius: '9999px',
    position: 'absolute',
    left: '-1.25rem',
    top: '0.35rem',
    boxShadow: `0 0 0 5px ${theme.background}`
  };

  const achievementTagStyle = {
    display: 'inline-block',
    backgroundColor: `${theme.highlight}20`,
    color: theme.highlight,
    padding: '0.25rem 0.6rem',
    borderRadius: '0.375rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    lineHeight: '1.4'
  };

  return (
    <section id="education" className="py-8 md:py-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={titleStyle}>Education</h2>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="absolute left-5 top-[0.35rem] bottom-0 w-px" style={timelineLineStyle}></div>
        
        <div className="space-y-8">
          {data?.map((education, index) => (
            education.isVisible && (
              <div key={index} className="relative pl-10">
                <div style={timelineDotStyle}></div>
                
                <div style={cardStyle}>
                  <div style={dateStyle}>
                    {formatDate(education.startDate)} - {education.current ? 'Present' : formatDate(education.endDate)}
                  </div>
                  <h3 style={degreeStyle}>{education.degree}</h3>
                  <p style={institutionStyle}>
                    {education.institution} {education.location ? `| ${education.location}` : ''}
                  </p>
                  <p style={fieldStyle}>{education.field}</p>
                  {education.gpa && (
                    <p style={gpaStyle}>GPA: {education.gpa}</p>
                  )}
                  
                  {education.achievements && education.achievements.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {education.achievements.map((achievement, idx) => (
                        <span key={idx} style={achievementTagStyle}>
                          {achievement}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection; 