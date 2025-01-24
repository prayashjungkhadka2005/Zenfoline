const DeveloperHeader = () => {
    return (
      <header className="bg-gray-900 text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Developer Portfolio</h1>
          <nav className="space-x-4">
            <a href="#projects" className="hover:underline">
              Projects
            </a>
            <a href="#skills" className="hover:underline">
              Skills
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </header>
    );
  };
  
  export default DeveloperHeader;
  