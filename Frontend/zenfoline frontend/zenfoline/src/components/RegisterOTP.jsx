import { Link } from "react-router-dom";
import React from 'react';
import OTP from './OTP';
import useAuthStore from '../store/userAuthStore';

const RegisterOTP = () => {
  const email = useAuthStore((state) => state.email);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);

  return (
    <OTP
      email={email}
      verifyOtpMethod={verifyOtp}
      resendOtpMethod={resendOtp}
      onSuccessNavigateTo="/login"
    />
  );
};

export default RegisterOTP;
