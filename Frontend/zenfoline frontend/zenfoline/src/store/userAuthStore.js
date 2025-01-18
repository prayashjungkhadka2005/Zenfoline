import { create } from 'zustand';

const useSignUpStore = create((set) => ({
  email: '', 
  error: null,
  setEmail: (email) => set({ email }), 
  setError: (error) => set({ error }), 
  clearSignUpData: () => set({ email: '', error: null }), 
  signupUser: async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/user/registeruser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred during signup.');
      }

      const data = await response.json();
      set({ error: null }); 
      return data; 
    } catch (err) {
      set({ error: err.message }); 
    }
  },
}));

export default useSignUpStore;
