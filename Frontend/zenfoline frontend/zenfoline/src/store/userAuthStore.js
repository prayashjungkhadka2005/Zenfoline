import { create } from 'zustand';

const useAuthStore = create((set) => ({
  email: '', 
  error: null, 
  success: null,
  setSuccess: (message) => set({ success: message }),
  setEmail: (email) => set({ email }),
  setError: (error) => set({ error }),

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
      set({ error: null, email }); 
      return data;
    } catch (err) {
      set({ error: err.message });
      throw err; 
    }
  },

  verifyOtp: async ({ otp, email }) => {
    try {
      const response = await fetch('http://localhost:3000/user/verifyregisterotp', {
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
    const response = await fetch('http://localhost:3000/user/resendotp', {
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
    const response = await fetch('http://localhost:3000/user/userlogin', {
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

forgotEmail: async (email) => {
  try {
    const response = await fetch('http://localhost:3000/user/forgotpassword', {
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
    const response = await fetch('http://localhost:3000/user/verifyforgototp', {
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
    const response = await fetch('http://localhost:3000/user/updatepassword', {
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





}));

export default useAuthStore;
