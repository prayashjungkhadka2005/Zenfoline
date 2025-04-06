import React, { createContext, useContext } from 'react';

const TemplateContext = createContext();

export const TemplateProvider = ({ children, mode = 'preview' }) => {
  return (
    <TemplateContext.Provider value={{ mode }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplateMode = () => useContext(TemplateContext); 