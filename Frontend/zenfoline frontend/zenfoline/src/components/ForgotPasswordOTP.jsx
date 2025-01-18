import React from 'react';
import OTP from './OTP';
import useAuthStore from '../store/userAuthStore';

const ForgotPasswordOTP = () => {
  const email = useAuthStore((state) => state.email);
  const verifyForgotPasswordOtp = useAuthStore((state) => state.verifyForgotPasswordOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);

  return (
    <OTP
      email={email}
      verifyOtpMethod={verifyForgotPasswordOtp}
      resendOtpMethod={resendOtp}
      onSuccessNavigateTo="/resetpassword"
    />
  );
};

export default ForgotPasswordOTP;
