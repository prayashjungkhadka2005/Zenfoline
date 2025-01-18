import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';
import InputField from './InputField';
import logo from '../assets/logo.png';

const Signup = () => {
  const [password, setPassword] = useState('');
  const setEmail = useAuthStore((state) => state.setEmail);
  const setError = useAuthStore((state) => state.setError);
  const signupUser = useAuthStore((state) => state.signupUser);
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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill out all fields!');
      return;
    }

    try {
      await signupUser(email, password);
      navigate('/registerotp');
    } catch (err) {
      console.error('Signup failed:', err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[545px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">Signup for free</h1>
        </div>

        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

        <div className="w-full p-2 border-b-0 mx-auto">
          <form onSubmit={handleSubmit}>
            <InputField
              label="Enter your email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <InputField
              label="Password"
              placeholder="Create your password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <button
              type="submit"
              className="w-full bg-[#FE6C05] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              Signup now
            </button>

            <p className="text-center text-[14px]">
              Already Registered?
              <Link to="/login">
                <span className="text-[darkblue] text-[14px] px-1 cursor-pointer">
                  Login
                </span>
              </Link>
            </p>

            <button
              type="button"
              className="flex items-center justify-center gap-2 w-full bg-[#DB4437] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              <i className="fa-brands fa-google text-lg"></i>
              Signup with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
