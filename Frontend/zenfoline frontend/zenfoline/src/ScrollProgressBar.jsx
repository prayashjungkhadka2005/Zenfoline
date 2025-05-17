import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      setScroll(docHeight ? (scrolled / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-orange-500 transition-all duration-200"
        style={{ width: `${scroll}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar; 