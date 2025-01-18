import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';
import InputField from './InputField';
import logo from '../assets/logo.png';

const AdminSignup = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const setEmail = useAuthStore((state) => state.setEmail);
  const setError = useAuthStore((state) => state.setError);
  const signupAdmin = useAuthStore((state) => state.signupAdmin); 
  const email = useAuthStore((state) => state.email);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();

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

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Please fill out all fields!');
      return;
    }

    try {
      await signupAdmin( username, email, password ); 
      navigate('/adminlogin'); 
    } catch (err) {
      console.error('Admin Signup failed:', err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[600px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">Admin Signup</h1>
        </div>

        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

        <div className="w-full p-2 border-b-0 mx-auto">
          <form onSubmit={handleSubmit}>
            <InputField
              label="Enter your username"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
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
              Already an Admin?
              <Link to="/admin-login">
                <span className="text-[darkblue] text-[14px] px-1 cursor-pointer">
                  Login
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
