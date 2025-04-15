import React from 'react';
import { getSkillLevelPercentage } from '../utils/helpers';
import { motion } from 'framer-motion';

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
    backgroundColor: `${theme.primary}80`,
    backdropFilter: 'blur(8px)',
    padding: '1.25rem',
    borderRadius: '1rem',
    boxShadow: `0 4px 20px ${theme.primary}20`,
    border: `1px solid ${theme.highlight}20`,
    transition: 'all 0.3s ease',
    cursor: 'default',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: `0 8px 25px ${theme.primary}30`,
      border: `1px solid ${theme.highlight}40`,
    }
  };

  const skillBarStyle = {
    backgroundColor: `${theme.primary}40`,
    width: '100%',
    height: '0.5rem',
    borderRadius: '9999px',
    overflow: 'hidden',
    marginTop: '0.5rem'
  };

  const skillBarProgressStyle = (percentage) => ({
    backgroundColor: theme.highlight,
    height: '0.5rem',
    borderRadius: '9999px',
    width: `${percentage}%`,
    transition: 'width 1s ease-in-out',
    boxShadow: `0 0 10px ${theme.highlight}50`
  });

  const categoryTitleStyle = {
    color: theme.text,
    borderBottom: `2px solid ${theme.highlight}40`,
    paddingBottom: '0.75rem',
    marginBottom: '1.5rem',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: '0',
      width: '50px',
      height: '2px',
      backgroundColor: theme.highlight,
    }
  };

  // Responsive classes
  const responsiveClasses = {
    section: 'py-12 md:py-16',
    headerContainer: 'text-center mb-10',
    title: 'text-3xl md:text-4xl font-bold',
    skillsGrid: 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto',
    skillsContainer: 'grid grid-cols-1 sm:grid-cols-2 gap-5',
    categoryTitle: 'text-2xl font-medium',
    skillName: 'font-medium mb-1',
    skillLevel: 'text-xs mt-2 text-right block opacity-70'
  };

  const SkillItem = ({ name, level }) => {
    const percentage = getSkillLevelPercentage(level);
    return (
      <motion.div 
        style={skillItemStyle}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className={responsiveClasses.skillName} style={textStyle}>{name}</h4>
        <div style={skillBarStyle}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={skillBarProgressStyle(percentage)}
          ></motion.div>
        </div>
        <span className={responsiveClasses.skillLevel} style={textStyle}>{level}</span>
      </motion.div>
    );
  };

  return (
    <section id="skills" className={responsiveClasses.section}>
      <div className={responsiveClasses.headerContainer}>
        <motion.h2 
          className={responsiveClasses.title} 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Skills
        </motion.h2>
      </div>
      
      <div className={responsiveClasses.skillsGrid}>
        {/* Technical Skills */}
        {skills.technical && skills.technical.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={responsiveClasses.categoryTitle} style={categoryTitleStyle}>
              Technical Skills
            </h3>
            <div className={responsiveClasses.skillsContainer}>
              {skills.technical.map((skill, index) => (
                <SkillItem key={index} name={skill.name} level={skill.level} />
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Soft Skills */}
        {skills.soft && skills.soft.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className={responsiveClasses.categoryTitle} style={categoryTitleStyle}>
              Soft Skills
            </h3>
            <div className={responsiveClasses.skillsContainer}>
              {skills.soft.map((skill, index) => (
                <SkillItem key={index} name={skill.name} level={skill.level} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
