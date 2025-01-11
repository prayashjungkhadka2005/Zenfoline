import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./InputField";
import logo from "../assets/logo.png";
import axios from "axios";

const RegisterOTP = () => {
  const [otp, setOtp] = useState(""); 
  const [error, setError] = useState(""); // State to store error messages
  const [successMessage, setSuccessMessage] = useState(""); // State to store success messages

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setSuccessMessage(""); // Clear previous success message

    // Check if OTP is empty
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/user/verifyregisterotp",
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If OTP verification is successful
      setSuccessMessage(response.data.message || "OTP verified successfully");
      navigate("/dashboard");
    } catch (error) {
      // Handle error response from the backend
      const errorMessage =
        error.response?.data?.message || "Failed to verify OTP. Try again.";
      setError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    setError(""); // Clear previous error
    setSuccessMessage(""); // Clear previous success message

    try {
      const response = await axios.post(
        "http://localhost:3000/user/resendotp",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If OTP is resent successfully
      setSuccessMessage(response.data.message || "OTP has been resent");
    } catch (error) {
      // Handle error response from the backend
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP. Try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto  w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[400px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
            Verify OTP
          </h1>
        </div>

  {/* Display error message */}
  {error && <p className="text-red-500 text-xs text-center">{error}</p>}

{/* Display success message */}
{successMessage && (
  <p className="text-green-500 text-xs text-center">{successMessage}</p>
)}

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

          <p className="text-center text-[14px] ">
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
