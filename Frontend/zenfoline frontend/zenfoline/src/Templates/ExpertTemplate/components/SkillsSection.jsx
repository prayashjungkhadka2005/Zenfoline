import React from 'react';
import { getSkillLevelPercentage } from '../utils/helpers';

// Accept theme prop
const SkillsSection = ({ data, theme }) => {
  const skills = data || {}; // data might be { technical: [], soft: [] }

  const titleStyle = {
    color: theme.highlight,
    marginBottom: '1.5rem'
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const skillItemStyle = {
    backgroundColor: theme.primary,
    opacity: 0.9,
    padding: '1rem',
    borderRadius: '0.5rem'
  };

  const skillBarStyle = {
    backgroundColor: theme.primary,
    width: '100%',
    height: '0.625rem',
    borderRadius: '9999px'
  };

  const skillBarProgressStyle = (percentage) => ({
    backgroundColor: theme.highlight,
    height: '0.625rem',
    borderRadius: '9999px',
    width: `${percentage}%`
  });

  const categoryTitleStyle = {
    color: theme.text,
    borderBottom: `2px solid ${theme.highlight}`,
    paddingBottom: '0.5rem',
    marginBottom: '1rem'
  };

  // Responsive classes
  const responsiveClasses = {
    section: 'py-8 md:py-12',
    headerContainer: 'text-center mb-6',
    title: 'text-3xl md:text-4xl font-bold',
    skillsGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto',
    skillsContainer: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    categoryTitle: 'text-2xl font-semibold',
    skillName: 'font-semibold mb-2',
    skillLevel: 'text-xs mt-1 text-right block'
  };

  const SkillItem = ({ name, level }) => {
    const percentage = getSkillLevelPercentage(level);
    return (
      <div style={skillItemStyle}>
        <h4 className={responsiveClasses.skillName} style={textStyle}>{name}</h4>
        <div style={skillBarStyle}>
          <div style={skillBarProgressStyle(percentage)}></div>
        </div>
        <span className={responsiveClasses.skillLevel} style={textStyle}>{level}</span>
      </div>
    );
  };

  return (
    <section id="skills" className={responsiveClasses.section}>
      <div className={responsiveClasses.headerContainer}>
        <h2 className={responsiveClasses.title} style={titleStyle}>Skills</h2>
        {/* Optional Subtitle */}
        {/* <p className={`text-lg md:text-xl ${textColor} max-w-3xl mx-auto`}>My technical and professional abilities.</p> */}
      </div>
      
      <div className={responsiveClasses.skillsGrid}>
        {/* Technical Skills */}
        {skills.technical && skills.technical.length > 0 && (
          <div>
            <h3 className={responsiveClasses.categoryTitle} style={categoryTitleStyle}>
              Technical Skills
            </h3>
            <div className={responsiveClasses.skillsContainer}>
              {skills.technical.map((skill, index) => (
                <SkillItem key={index} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>
        )}
        
        {/* Soft Skills */}
        {skills.soft && skills.soft.length > 0 && (
          <div>
            <h3 className={responsiveClasses.categoryTitle} style={categoryTitleStyle}>
              Soft Skills
            </h3>
            <div className={responsiveClasses.skillsContainer}>
              {skills.soft.map((skill, index) => (
                <SkillItem key={index} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
