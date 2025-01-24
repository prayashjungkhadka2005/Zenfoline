const SimpleFooter = () => {
    return (
      <footer className="bg-gray-100 text-gray-700 py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Simple Portfolio. All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default SimpleFooter;
  