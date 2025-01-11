import React, { useState } from 'react'; 
import { Link, useNavigate } from "react-router-dom"; 
import InputField from './InputField';
import logo from "../assets/logo.png";
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(''); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordError('');

    if (password.length <= 4) {
      setPasswordError('Password must be greater than 4 characters');
      return; 
    }

    console.log('Email:', email);
    console.log('Password:', password);

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:3000/user/registeruser', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Signup successful', response.data);
      
      navigate('/registerotp'); 
    } catch (error) {
      console.error('Error signing up', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
    <div className="text-center mb-6 w-full max-w-md">
      <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">Signup for free</h1>
    </div>
  
    <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[545px] outline-none border-2 border-[#000000]/21">
      <div className="text-center mb-3">
        <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
      </div>
  
      <div className="w-full p-2 border-b-0 mx-auto">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Enter your email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            placeholder="Create your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
  
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
