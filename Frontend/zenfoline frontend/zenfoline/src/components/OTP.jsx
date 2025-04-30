import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import { useNavigate } from 'react-router-dom';

const OTP = ({ onSuccessNavigateTo, verifyOtpMethod, resendOtpMethod, email }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [otpTouched, setOtpTouched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpTouched(true);
    if (!otp) {
      setError('OTP is required.');
      return;
    }
    try {
      await verifyOtpMethod({ otp, email });
      setSuccess('OTP verified successfully!');
      setTimeout(() => navigate(onSuccessNavigateTo), 1000);
    } catch (err) {
      setError(err.message || 'Error verifying OTP.');
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtpMethod(email);
      setSuccess('OTP resent successfully!');
    } catch (err) {
      setError(err.message || 'Error resending OTP.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FE6C05] to-[#DB4437] bg-clip-text text-transparent">
          Verify OTP
        </h1>
        <p className="text-gray-600 text-sm mt-1">Enter the OTP sent to your email</p>
      </div>
      <div className="w-full">
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <InputField
              label="Enter 6-digit OTP"
              placeholder="Enter OTP"
              type="number"
              value={otp}
              onChange={(e) => { setOtp(e.target.value); setOtpTouched(true); }}
              className={error && otpTouched && !otp ? 'border-red-400' : ''}
            />
            {error && otpTouched && !otp && (
              <p className="text-xs text-red-500 mt-1 ml-1">OTP is required.</p>
            )}
          </div>
          {/* Backend error message (not field-level) */}
          {error && otp && error !== 'OTP is required.' && (
            <p className="text-sm text-red-500 text-center mb-2">{error}</p>
          )}
          {/* Success message */}
          {success && (
            <p className="text-sm text-green-600 text-center mb-2">{success}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FE6C05] to-[#DB4437] text-white font-medium text-sm rounded-lg py-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Verify
          </button>
        </form>
        <p className="text-center text-xs mt-4">
          Not received OTP?{' '}
          <span
            className="text-[#FE6C05] hover:text-[#DB4437] font-medium px-1 cursor-pointer transition-colors"
            onClick={handleResendOtp}
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default OTP;
