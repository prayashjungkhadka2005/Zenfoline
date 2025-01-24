export const fetchAPI = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('FetchAPI Error:', error.message);
      throw error;
    }
  };
  