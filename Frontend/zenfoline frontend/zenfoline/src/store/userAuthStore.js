import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useTemplateStore from './userTemplateStore';

const useAuthStore = create(
  persist(
    (set) => ({
      email: '',
      username: '',
      adminId: '',
      userId: '',
      error: null,
      success: null,
      token: null,
      isAuthenticated: false,
      setSuccess: (message) => set({ success: message }),
      setUsername: (username) => set({ username }),
      setEmail: (email) => set({ email }),
      setError: (error) => set({ error }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      logout: () => {
        // Clear auth store
        set({
          email: '',
          username: '',
          userId: '',
          token: null,
          isAuthenticated: false
        });
        
        // Clear template store
        useTemplateStore.setState({
          templates: [],
          activeTemplateId: null,
          loading: false,
          error: null,
          hasCheckedActiveTemplate: false
        });
        
        // Clear template store from session storage
        sessionStorage.removeItem('user-template-store');
      },

      signupAdmin: async (username, email, password) => {
        try {
          const response = await fetch('http://localhost:3000/auth/addadmin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred during admin signup.');
          }

          const data = await response.json();
          set({ error: null, success: 'Admin registered successfully' });
          return data;
        } catch (err) {
          set({ error: err.message, success: null });
          throw err;
        }
      },

      adminLogin: async (username, password) => {
        try {
          const response = await fetch('http://localhost:3000/auth/adminlogin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred during admin login.');
          }

          const data = await response.json();
          set({ 
            error: null, 
            username: data.username, 
            adminId: data.admin_id,
            token: data.token,
            isAuthenticated: true
          });
          return data;
        } catch (err) {
          set({ error: err.message, success: null });
          throw err;
        }
      },

      signupUser: async (email, password) => {
        try {
          const response = await fetch('http://localhost:3000/auth/registeruser', {
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
          set({ error: null, email }); 
          return data;
        } catch (err) {
          set({ error: err.message });
          throw err; 
        }
      },

      verifyOtp: async ({ otp, email }) => {
        try {
          const response = await fetch('http://localhost:3000/auth/verifyregisterotp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp, email }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to verify OTP.');
          }

          const data = await response.json();
          set({ error: null });
          return data;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      resendOtp: async (email) => {
        try {
          const response = await fetch('http://localhost:3000/auth/resendotp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to resend OTP.');
          }

          const data = await response.json();
          set({ success: data.message, error: null }); 
          return data;
        } catch (err) {
          set({ error: err.message, success: null });
          throw err;
        }
      },

      loginUser: async (email, password) => {
        try {
          const response = await fetch('http://localhost:3000/auth/userlogin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred during login.');
          }

          const data = await response.json();
          set({ 
            error: null, 
            email: data.email, 
            userId: data.user_id,
            token: data.token,
            isAuthenticated: true
          });
          return data;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      forgotEmail: async (email) => {
        try {
          const response = await fetch('http://localhost:3000/auth/forgotpassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email}),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred during forgot password.');
          }

          const data = await response.json();
          set({ error: null, email }); 
          return data;
        } catch (err) {
          set({ error: err.message });
          throw err; 
        }
      },

      verifyForgotPasswordOtp: async ({ otp, email }) => {
        try {
          const response = await fetch('http://localhost:3000/auth/verifyforgototp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp, email }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to verify OTP.');
          }

          const data = await response.json();
          set({ error: null });
          return data;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      resetPassword: async ({ email, newPassword }) => {
        try {
          const response = await fetch('http://localhost:3000/auth/updatepassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({  email, newPassword }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to reset passowrd.');
          }

          const data = await response.json();
          set({ success: data.message, error: null, email }); 
          return data;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },
    }),
    {
      name: 'auth-store',
      storage: {
        getItem: (key) => {
          const storedValue = sessionStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)), 
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
);

export default useAuthStore;
