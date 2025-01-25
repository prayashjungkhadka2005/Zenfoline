import React, { useEffect } from "react";
import WebFont from "webfontloader";
import profile from "../assets/profile.png";

const SimplePortfolioTemplate = ({ fontStyle }) => {
  console.log("Current font style:", fontStyle);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [fontStyle],
      },
    });
  }, [fontStyle]);

  return (
    <div
      style={{
        fontFamily: `${fontStyle}, ${
          ["Inria Serif", "Crimson Text", "Source Serif Pro", "Playfair Display", "Lobster"].includes(
            fontStyle
          )
            ? "serif"
            : "sans-serif"
        }`,
      }}
      className="min-h-screen bg-gray-900 text-gray-200 flex flex-col justify-center items-center"
    >
      {/* Hero Section */}
      <section className="py-16 bg-gray-900 flex flex-col items-center text-center">
        {/* Profile Image */}
        <div className="mb-6">
          <img
            src={profile}
            alt="Profile"
            className="w-64 h-64 rounded-full shadow-lg"
          />
        </div>

        {/* Name and Details */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">
            Hi, I am <span className="text-orange-500">Sazzy.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            A Passionate Software Developer.
          </p>

          {/* Button */}
          <button className="px-8 py-3 bg-orange-500 text-white text-lg font-medium rounded-md hover:bg-orange-600">
            View Projects
          </button>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-12 bg-gray-800 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
            {[
              { name: "Python", icon: "fab fa-python" },
              { name: "JavaScript", icon: "fab fa-js-square" },
              { name: "React", icon: "fab fa-react" },
              { name: "HTML5", icon: "fab fa-html5" },
              { name: "CSS3", icon: "fab fa-css3-alt" },
              { name: "Git", icon: "fab fa-git-alt" },
              { name: "Node.js", icon: "fab fa-node-js" },
              { name: "Docker", icon: "fab fa-docker" },
            ].map((skill, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow-md w-24 h-24"
              >
                <i className={`${skill.icon} text-3xl text-orange-500 mb-2`}></i>
                <p className="text-sm">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="portfolio" className="py-12 bg-gray-900 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Projects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "E-commerce App", icon: "fas fa-shopping-cart" },
              { name: "Portfolio Website", icon: "fas fa-briefcase" },
              { name: "Chat Application", icon: "fas fa-comments" },
              { name: "Weather App", icon: "fas fa-cloud-sun" },
              { name: "Task Manager", icon: "fas fa-tasks" },
              { name: "Fitness Tracker", icon: "fas fa-dumbbell" },
            ].map((project, index) => (
              <div
                key={index}
                className="bg-gray-800 h-40 rounded-lg shadow-md flex flex-col items-center justify-center text-gray-400 text-center p-4"
              >
                <i className={`${project.icon} text-4xl text-orange-500 mb-2`}></i>
                <p className="text-sm">{project.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 w-full">
        <div className="container mx-auto text-center">
          <p>Contact me: myemail@example.com</p>
          <p className="text-sm mt-2">&copy; 2025 My Portfolio. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SimplePortfolioTemplate;
