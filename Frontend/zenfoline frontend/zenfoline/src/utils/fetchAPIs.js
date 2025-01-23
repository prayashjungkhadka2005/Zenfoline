export const fetchAPI = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        // Handle response errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred.');
      }
  
      // Return parsed JSON data
      return await response.json();
    } catch (error) {
      // Handle network or unexpected errors
      console.error('FetchAPI Error:', error.message);
      throw error;
    }
  };
  