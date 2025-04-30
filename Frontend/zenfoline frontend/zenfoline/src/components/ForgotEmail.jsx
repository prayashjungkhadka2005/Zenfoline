import React, { useEffect, useState } from 'react';
import InputField from './InputField';
import logo from '../assets/logo.png';
import useAuthStore from '../store/userAuthStore';
import { useNavigate } from 'react-router-dom'; 

const ForgotEmail = () => {
  const setEmail = useAuthStore((state) => state.setEmail);
  const setError = useAuthStore((state) => state.setError);
  const forgotEmail = useAuthStore((state) => state.forgotEmail);
  const email = useAuthStore((state) => state.email || "");
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    setEmail(''); 
    setError(null); 
  }, [setError, setEmail]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [error, setError]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value || "");
    setEmailTouched(true);
  };

  const handleforgotemail = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter the email!');
      return;
    }

    try {
      await forgotEmail(email);
      navigate('/forgotpasswordotp');
    } catch (err) {
      console.error('Forgot password failed:', err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center w-full max-w-5xl gap-8 px-4">
        <div className="flex flex-col justify-center items-center w-1/2 h-[400px] relative overflow-hidden">
          {/* Abstract SVG background */}
          <svg className="absolute -top-16 -left-24 w-[500px] h-[500px] opacity-30 z-0" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="250" cy="250" rx="250" ry="200" fill="url(#paint0_radial)" />
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(250 250) scale(250 200)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FE6C05" stopOpacity="0.18" />
                <stop offset="1" stopColor="#DB4437" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
          {/* Glassmorphism card */}
          <div className="relative z-10 flex flex-col items-center backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl shadow-lg px-10 py-12">
            <img src={logo} alt="Logo" className="mx-auto w-60 h-auto drop-shadow-xl mb-4" />
            <p className="text-xl text-gray-700 font-semibold text-center max-w-xs mb-2">
              Your all-in-one solution for <span className="text-[#FE6C05] font-bold">seamless workflow</span> and productivity.
            </p>
            <p className="text-base text-gray-500 italic text-center max-w-xs mt-2">"Empowering you to achieve more, every day."</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl w-1/2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FE6C05] to-[#DB4437] bg-clip-text text-transparent">Forgot Password</h1>
            <p className="text-gray-600 text-sm mt-1">Enter your email to reset your password</p>
          </div>
          <div className="w-full">
            <form onSubmit={handleforgotemail} className="space-y-4">
              <div>
                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  className={error && emailTouched && !email ? 'border-red-400' : ''}
                />
                {error && emailTouched && !email && (
                  <p className="text-xs text-red-500 mt-1 ml-1">Email is required.</p>
                )}
              </div>
              {/* Backend error message (not field-level) */}
              {error && email && error !== 'Please enter the email!' && (
                <p className="text-sm text-red-500 text-center mb-2">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FE6C05] to-[#DB4437] text-white font-medium text-sm rounded-lg py-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotEmail;
