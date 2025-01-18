import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import logo from "../assets/logo.png";
import useAuthStore from '../store/userAuthStore';

const Login = () => {
  const [password, setPassword] = useState('');
  const setEmail = useAuthStore((state) => state.setEmail);
  const setError = useAuthStore((state) => state.setError);
  const loginUser = useAuthStore((state) => state.loginUser);
  const email = useAuthStore((state) => state.email);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setEmail(''); 
  }, [setError, setEmail]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill out all fields!');
      return;
    }

    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[565px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
            Login to Zenfoline
          </h1>
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="w-full p-2 border-b-0 mx-auto">
          <form onSubmit={handleLogin}>
            <InputField
              label="Email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <InputField
              label="Password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <div className="flex md:flex-row justify-between mx-2 my-2 items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-3 md:text-xs text-[12px]"
                />
                <label className="md:text-xs text-[12px]">Remember Me</label>
              </div>
              <Link to={"/forgotemail"}>
                <p className="md:text-xs text-[12px] cursor-pointer">
                  Forgot Password?
                </p>
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FE6C05] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              Login now
            </button>

            <p className="text-center text-[14px] ">
              Not registered yet?
              <Link to="/signup">
                <span className="text-[darkblue] text-[14px] px-1 cursor-pointer">
                  Signup Now
                </span>
              </Link>
            </p>

            <button
              type="button"
              className="flex items-center justify-center gap-2 w-full bg-[#DB4437] text-white font-light text-[18px] rounded-md py-3 my-4 cursor-pointer"
            >
              <i className="fa-brands fa-google text-lg"></i>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
