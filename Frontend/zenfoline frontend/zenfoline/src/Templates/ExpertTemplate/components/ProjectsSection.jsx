import React from 'react';
import { FaCode, FaGlobe } from 'react-icons/fa';
import { expertStyles } from '../styles/expertStyles';

const ProjectsSection = ({ data }) => {
  return (
    <section id="projects" className="py-20 bg-black bg-opacity-50 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {data.projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.images && project.images.length > 0 ? project.images[0] : [
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  ][index % 4]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', e.target.src);
                    e.target.onerror = null;
                    e.target.src = [
                      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    ][index % 4];
                  }}
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                <p className="text-gray-400 mb-6 line-clamp-3 text-lg">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray(project.technologies) 
                    ? project.technologies 
                    : project.technologies?.split(',').map(tech => tech.trim())
                  )?.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-orange-500 bg-opacity-20 text-orange-500 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-6">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                    >
                      <FaGlobe className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                    >
                      <FaCode className="w-5 h-5" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 