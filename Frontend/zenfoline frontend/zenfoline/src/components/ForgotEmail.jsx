import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom'; 

const ForgotEmail = () => {
  const [email, setEmailState] = useState('');  // Local state for email
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());  // Clear error on component mount
  }, [dispatch]);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmailState(emailValue);  // Update local state
    dispatch(setEmail(emailValue));  // Update Redux store state
  };

  const handleforgotemail = (e) => {
    e.preventDefault();
    dispatch(forgotemail({ email }))  // Pass email as an object to the action
      .unwrap()
      .then(() => {
        navigate('/forgotpasswordotp');  // Navigate after successful action
      })
      .catch((err) => {
        console.error(err);  // Log any errors
      });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[400px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">Forgot Password</h1>
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="w-full p-2 border-b-0 mx-auto">
          <form onSubmit={handleforgotemail}>
            <InputField
              label="Enter your email"
              placeholder="Enter your email"
              type="text"
              value={email}
              onChange={handleEmailChange}
            />
            <button
              type="submit"
              className="w-full bg-[#FE6C05] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotEmail;
