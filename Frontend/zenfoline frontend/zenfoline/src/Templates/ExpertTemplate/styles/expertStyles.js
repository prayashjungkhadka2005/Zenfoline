export const expertStyles = {
  section: {
    base: "py-20 relative",
    withBg: "bg-black bg-opacity-50",
    container: "container mx-auto px-6 relative z-10",
  },
  headings: {
    main: "text-4xl font-bold text-center mb-12",
    sub: "text-2xl font-semibold mb-6",
  },
  cards: {
    base: "bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300",
    content: "p-8",
  },
  buttons: {
    primary: "px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2",
    secondary: "px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2",
  },
  text: {
    primary: "text-gray-300",
    secondary: "text-gray-400",
    accent: "text-orange-500",
  },
  backgrounds: {
    overlay: "absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 animate-gradient",
    pattern: "absolute inset-0 bg-cover bg-center opacity-10",
  },
  skills: {
    bar: {
      container: "w-full bg-gray-700 h-2 rounded-full",
      progress: "bg-orange-500 h-2 rounded-full transition-all duration-1000",
    }
  },
  tags: {
    base: "px-4 py-2 bg-orange-500 bg-opacity-20 text-orange-500 rounded-full text-sm",
  },
  links: {
    base: "text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg",
  }
}; 