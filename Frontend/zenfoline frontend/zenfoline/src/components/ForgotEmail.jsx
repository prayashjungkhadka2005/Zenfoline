import React, { useEffect } from 'react';
import InputField from './InputField';
import logo from '../assets/logo.png';
import useAuthStore from '../store/userAuthStore';
import { useNavigate } from 'react-router-dom'; 

const ForgotEmail = () => {
  const setEmail = useAuthStore((state) => state.setEmail);
  const setError = useAuthStore((state) => state.setError);
  const forgotEmail = useAuthStore((state) => state.forgotEmail);
  const email = useAuthStore((state) => state.email);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(''); 
    setError(null); 
  }, [setError, setEmail]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setError(null);
        }, 3000);
        return () => clearTimeout(timer); 
      
    }, [error, setError]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleforgotemail = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter the email!');
      return;
    }

    try {
      await forgotEmail(email);
      navigate('/registerotp');
    } catch (err) {
      console.error('Forgot password failed:', err.message);
    }
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
