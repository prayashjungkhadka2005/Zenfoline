import React, { useState } from 'react'; 
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import InputField from './InputField';
import logo from "../assets/logo.png";
import axios from 'axios';

const RegisterOTP = () => {
  const [otp, setotp] = useState('');
const [OTPError, setOTPError] = useState(''); 

 
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous password errors
    setOTPError('');

    // Check if password length is greater than 4
    if (otp.length <= 6) {
      setOTPError('OTP must be greater than 6 characters');
      return; // Prevent form submission if password is invalid
    }

    console.log('OTP:', otp);
    

    // Prepare data to send
    const userData = {
      otp,
    };

    try {
      // Make API request to backend
      const response = await axios.post('http://localhost:3000/user/verifyregisterotp', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('OTP Verified', response.data);
      
      // Navigate to the next page on success
      navigate('/login'); // Replace '/login' with your desired path
    } catch (error) {
      console.error('Error otp verification', error);
      // Display an error message to the user
      alert('OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
        OTP Verification
        </h1>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-lg w-[700px]">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-60 h-35" />
        </div>

    


        <div className="w-full p-2 my-4  border-b-0 mx-auto">
          <form onSubmit={handleSubmit}>
            <InputField 
              label="OTP" 
              placeholder="OTP" 
              type="text" 
              value={otp} 
              onChange={(e) => setotp(e.target.value)} 
            />
            
            {/* Display error message if password is invalid */}
            {OTPError && <p className="text-red-500 text-xs px-3">{OTPError}</p>}

            <button
              type="submit"
              className="w-full bg-[#FE6C05] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              Verify OTP
            </button>

            <p className="text-center text-[14px] pt-0 py-2">
              Resend OTP
              <Link to="/login">
                <span className="text-[black] text-[16px] px-1 cursor-pointer">
                  Login
                </span>
              </Link>
            </p>

            <button
              type="submit"
              className="w-full bg-[#DB4437] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterOTP;
