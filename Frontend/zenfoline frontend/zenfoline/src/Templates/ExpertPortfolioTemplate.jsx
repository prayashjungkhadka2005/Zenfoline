import React, { useEffect } from "react";
import WebFont from "webfontloader";
import profile from "../assets/profile.png";

const ExpertPortfolioTemplate = ({ fontStyle = 'Poppins', template, data }) => {
  // Use fontStyle from props or data, with a fallback to 'Poppins'
  const currentFontStyle = fontStyle || (data?.theme?.fontStyle) || 'Poppins';

  useEffect(() => {
    if (currentFontStyle) {
      WebFont.load({
        google: {
          families: [currentFontStyle],
        },
      });
    }
  }, [currentFontStyle]);

  return (
    <div
      style={{
        fontFamily: `${currentFontStyle}, ${
          ["Inria Serif", "Crimson Text", "Source Serif Pro", "Playfair Display", "Lobster"].includes(
            currentFontStyle
          )
            ? "serif"
            : "sans-serif"
        }`,
      }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    >
      {/* Navigation */}
      <nav className="fixed w-full bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
            <a href="#skills" className="hover:text-orange-500 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-orange-500 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 animate-gradient"></div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Expert <span className="text-orange-500">Developer</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Crafting exceptional digital experiences with cutting-edge technology
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                View Projects
              </button>
              <button className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                Contact Me
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-orange-500 shadow-2xl transform hover:scale-105 transition-transform">
              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-black bg-opacity-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { name: "React", level: 95 },
              { name: "Node.js", level: 90 },
              { name: "Python", level: 85 },
              { name: "AWS", level: 80 },
              { name: "Docker", level: 85 },
              { name: "GraphQL", level: 75 },
              { name: "TypeScript", level: 90 },
              { name: "MongoDB", level: 85 },
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-4">{skill.name}</h3>
                <div className="w-full bg-gray-600 h-2 rounded-full">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400 mt-2">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce Platform",
                description: "Full-stack e-commerce solution with React and Node.js",
                tech: ["React", "Node.js", "MongoDB", "AWS"],
              },
              {
                title: "AI Image Generator",
                description: "AI-powered image generation using Python and TensorFlow",
                tech: ["Python", "TensorFlow", "Flask", "Docker"],
              },
              {
                title: "Real-time Chat App",
                description: "Real-time messaging with WebSocket and GraphQL",
                tech: ["React", "GraphQL", "Node.js", "Socket.io"],
              },
            ].map((project, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-500 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black bg-opacity-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="text-xl text-gray-400 mb-8">
            Ready to start your next project? Get in touch!
          </p>
          <div className="flex justify-center gap-6">
            <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors">
              <i className="fas fa-envelope"></i>
              Email Me
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all">
              <i className="fab fa-linkedin"></i>
              LinkedIn
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 Expert Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ExpertPortfolioTemplate; 