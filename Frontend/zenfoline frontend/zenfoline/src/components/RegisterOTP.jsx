import { Link } from "react-router-dom";
import React from 'react';
import OTP from './OTP';
import useAuthStore from '../store/userAuthStore';
import logo from '../assets/logo.png';

const RegisterOTP = () => {
  const email = useAuthStore((state) => state.email);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);

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
        <div className="w-1/2">
          <OTP
            email={email}
            verifyOtpMethod={verifyOtp}
            resendOtpMethod={resendOtp}
            onSuccessNavigateTo="/login"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterOTP;
