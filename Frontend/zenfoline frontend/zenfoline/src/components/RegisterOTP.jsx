import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';

const RegisterOTP = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const email = useAuthStore((state) => state.email);
  const error = useAuthStore((state) => state.error);
  const success = useAuthStore((state) => state.success);
  const setError = useAuthStore((state) => state.setError);
  const setSuccess = useAuthStore((state) => state.setSuccess);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [setError, setSuccess]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [error, success, setError, setSuccess]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      await verifyOtp({ otp, email });
      navigate('/login');
    } catch (err) {
      console.error('Error verifying OTP:', err.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
    } catch (err) {
      console.error('Error resending OTP:', err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[400px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">Verify OTP</h1>
        </div>

        {success && <p className="text-green-500 text-xs text-center">{success}</p>}
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="w-full p-2 border-b-0 mx-auto">
          <form onSubmit={handleVerifyOtp}>
            <InputField
              label="Enter 6-digit OTP"
              placeholder="Enter OTP"
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-[#FE6C05] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              Verify
            </button>
          </form>

          <p className="text-center text-[14px]">
            Not received OTP?
            <span
              className="text-[darkblue] text-[14px] px-1 cursor-pointer"
              onClick={handleResendOtp}
            >
              Resend
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterOTP;
