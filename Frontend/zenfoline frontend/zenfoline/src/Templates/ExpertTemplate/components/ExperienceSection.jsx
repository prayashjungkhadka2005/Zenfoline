import React from 'react';
import { expertStyles } from '../styles/expertStyles';
import { formatDate } from '../utils/helpers';

const ExperienceSection = ({ data }) => {
  return (
    <section id="experience" className="py-20 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">Work Experience</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {data.experience.map((exp, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-102 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
              <div className="text-orange-500 mb-4">{exp.company} | {exp.location}</div>
              <div className="text-gray-400 mb-4">
                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
              </div>
              <p className="text-gray-300 mb-4">{exp.description}</p>
              {/* Render achievements if they exist */}
              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-gray-200">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 