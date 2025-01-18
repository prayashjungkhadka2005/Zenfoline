import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom'; 

const ForgotPasswordOTP = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const {  error, email } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ otp, email }))
      .unwrap()
      .then(() => {
        navigate('/login'); 
      })
      .catch((err) => console.error(err));
  };

  const handleResendOtp = () => {
    dispatch(resendOtp(email)); 
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto  w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[400px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">Verify OTP</h1>
        </div>

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

export default ForgotPasswordOTP;
