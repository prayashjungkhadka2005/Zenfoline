import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:3000/user/registeruser', userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ otp, email }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/user/verifyregisterotp',
      { otp, email }, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
  }
});

export const resendOtp = createAsyncThunk('auth/resendOtp', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/user/resendotp',
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    loading: false,
    error: null,
    otpVerified: false,
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.meta.arg.email; 
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setEmail } = authSlice.actions;
export default authSlice.reducer;
