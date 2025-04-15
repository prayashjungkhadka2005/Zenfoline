import React from 'react';
import { expertStyles } from '../styles/expertStyles';
import { getSkillLevelPercentage } from '../utils/helpers';

const SkillsSection = ({ data }) => {
  return (
    <section id="skills" className="py-20 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">Technical Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Technical Skills */}
          {data.skills.technical?.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">Technical Skills</h3>
              <div className="space-y-4">
                {data.skills.technical.map((skill, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-300">{skill.name}</span>
                      <span className="text-orange-500">{skill.proficiency || skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${getSkillLevelPercentage(skill.proficiency || skill.level)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {data.skills.soft?.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">Soft Skills</h3>
              <div className="space-y-4">
                {data.skills.soft.map((skill, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-300">{skill.name}</span>
                      <span className="text-orange-500">{skill.proficiency || skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${getSkillLevelPercentage(skill.proficiency || skill.level)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
