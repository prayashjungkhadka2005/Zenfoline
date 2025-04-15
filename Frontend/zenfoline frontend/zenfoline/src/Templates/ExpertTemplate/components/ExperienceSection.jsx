import React from 'react';
import { formatDate } from '../utils/helpers';
import { FaBriefcase } from 'react-icons/fa';

// Accept theme prop
const ExperienceSection = ({ data, theme }) => {
  const titleStyle = {
    color: theme.highlight
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const cardStyle = {
    backgroundColor: `${theme.primary}1A`, // Subtle background using primary with alpha
    borderRadius: '0.75rem', // Larger radius
    padding: '1.5rem', // Added padding
    border: `1px solid ${theme.primary}40` // Subtle border
  };

  const dateStyle = {
    color: theme.secondary,
    fontSize: '0.8rem', // Slightly smaller
    fontWeight: '500',
    marginBottom: '0.5rem' // Space below date
  };

  const positionStyle = {
    color: theme.highlight, // Use highlight color for position
    fontSize: '1.3rem', // Larger size
    fontWeight: '700', // Bolder
    marginBottom: '0.25rem'
  };

  const companyStyle = {
    color: theme.text,
    opacity: 0.85, // Slightly more opaque
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '0.75rem' // Space below company
  };

  const descriptionStyle = {
    color: theme.text,
    opacity: 0.8, // Slightly less opaque for contrast
    fontSize: '0.9rem',
    lineHeight: '1.6'
  };

  const timelineLineStyle = {
    borderColor: theme.highlight,
    opacity: 0.3,
    borderWidth: '1px' // Slightly thicker line
  };

  const timelineDotStyle = {
    backgroundColor: theme.highlight,
    width: '1rem',
    height: '1rem',
    borderRadius: '9999px',
    position: 'absolute',
    left: '-1.25rem',
    top: '0.35rem', // Matches the line's top offset
    boxShadow: `0 0 0 5px ${theme.background}`
  };

  // New style for achievement tags
  const achievementTagStyle = {
    display: 'inline-block',
    backgroundColor: `${theme.highlight}20`, // Highlight color with low alpha
    color: theme.highlight, // Use highlight color for text
    padding: '0.25rem 0.6rem',
    borderRadius: '0.375rem', // Rounded corners
    fontSize: '0.8rem', // Slightly smaller font
    fontWeight: '500',
    lineHeight: '1.4' // Adjust line height
  };

  return (
    <section id="experience" className="py-8 md:py-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={titleStyle}>Experience</h2>
        {/* Optional Subtitle */}
        {/* <p className={`text-lg md:text-xl ${textColor} max-w-3xl mx-auto`}>My professional journey.</p> */}
      </div>

      <div className="relative max-w-6xl mx-auto px-4"> {/* Changed from 4xl */}
        {/* Timeline Line - Adjusted top offset */}
        <div className="absolute left-5 top-[0.35rem] bottom-0 w-px" style={timelineLineStyle}></div>
        
        <div className="space-y-8"> {/* Reduced space between items */}
          {data?.map((job, index) => (
            job.isVisible && (
              <div key={index} className="relative pl-10"> {/* Increased left padding for dot */}
                {/* Timeline Dot */}
                <div style={timelineDotStyle}></div>
                
                {/* Experience Card */}
                <div style={cardStyle}>
                  <div style={dateStyle}>
                    {formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate)}
                  </div>
                  <h3 style={positionStyle}>{job.position || job.title}</h3>
                  <p style={companyStyle}>{job.company} {job.location ? `| ${job.location}` : ''}</p>
                  <p style={descriptionStyle}>{job.description}</p>
                  
                  {/* Achievements as Tags */}
                  {job.achievements && job.achievements.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Use flex container */}
                      {job.achievements.map((achievement, idx) => (
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

export default ExperienceSection; 