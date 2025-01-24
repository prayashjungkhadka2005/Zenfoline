import React from 'react';

const SimplePortfolioTemplate = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">My Portfolio</h1>
          <nav>
            <ul className="flex gap-6">
              <li>
                <a href="#about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:underline">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="bg-white text-center py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to My Portfolio
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            I am a passionate developer focused on building web applications
            that solve real-world problems.
          </p>
          <a
            href="#contact"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Contact Me
          </a>
        </div>
      </section>

      <section id="about" className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">About Me</h3>
          <p className="text-lg text-gray-600">
            Hi! I'm a software developer with expertise in frontend and backend
            technologies. I love creating intuitive and efficient web
            applications. In my free time, I contribute to open source projects
            and write tech blogs.
          </p>
        </div>
      </section>

      <section id="projects" className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Project 1
              </h4>
              <p className="text-gray-600">
                A description of your amazing project goes here.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Project 2
              </h4>
              <p className="text-gray-600">
                A description of your amazing project goes here.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Project 3
              </h4>
              <p className="text-gray-600">
                A description of your amazing project goes here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">Contact me: myemail@example.com</p>
          <p className="text-sm mt-2">&copy; 2025 My Portfolio. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SimplePortfolioTemplate;
