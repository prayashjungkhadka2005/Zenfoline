import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputField from "./InputField";
import logo from "../assets/logo.png";
import useAuthStore from '../store/userAuthStore';

const Login = () => {
  const [password, setPassword] = useState('');
  const setEmail = useAuthStore((state) => state.setEmail);
  const setError = useAuthStore((state) => state.setError);
  const loginUser = useAuthStore((state) => state.loginUser);
  const email = useAuthStore((state) => state.email || "");
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const location = useLocation();
  const message = location.state?.message;

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
    setEmail(e.target.value || "");
    setEmailTouched(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value || "");
    setPasswordTouched(true);
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
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center w-full max-w-5xl gap-8 px-4">
        <div className="flex flex-col justify-center items-center w-1/2 h-[500px] relative overflow-hidden">
          {/* Abstract SVG background */}
          <svg className="absolute -top-16 -left-24 w-[500px] h-[500px] opacity-30 z-0" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="250" cy="250" rx="250" ry="200" fill="url(#paint0_radial)" />
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(250 250) scale(250 200)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FE6C05" stopOpacity="0.18" />
                <stop offset="1" stopColor="#DB4437" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
          {/* Glassmorphism card */}
          <div className="relative z-10 flex flex-col items-center backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl shadow-lg px-10 py-12">
            <img src={logo} alt="Logo" className="mx-auto w-60 h-auto drop-shadow-xl mb-4" />
            <p className="text-xl text-gray-700 font-semibold text-center max-w-xs mb-2">
              Your all-in-one solution for <span className="text-[#FE6C05] font-bold">seamless workflow</span> and productivity.
            </p>
            <p className="text-base text-gray-500 italic text-center max-w-xs mt-2">"Empowering you to achieve more, every day."</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl w-1/2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FE6C05] to-[#DB4437] bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm mt-1">Login to access your Zenfoline account</p>
            {message && (
              <div className="text-red-500 text-center mt-2 font-medium animate-fade-in">
                {message}
              </div>
            )}
          </div>

          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  value={email || ""}
                  onChange={handleEmailChange}
                  className={error && emailTouched && !email ? 'border-red-400' : ''}
                />
                {error && emailTouched && !email && (
                  <p className="text-xs text-red-500 mt-1 ml-1">Email is required.</p>
                )}
              </div>
              <div>
                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={password || ""}
                  onChange={handlePasswordChange}
                  className={error && passwordTouched && !password ? 'border-red-400' : ''}
                />
                {error && passwordTouched && !password && (
                  <p className="text-xs text-red-500 mt-1 ml-1">Password is required.</p>
                )}
              </div>

              {/* Backend error message (not field-level) */}
              {error && email && password && error !== 'Please fill out all fields!' && (
                <p className="text-sm text-red-500 text-center mb-2">{error}</p>
              )}

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-3 h-3 text-[#FE6C05] border-gray-300 rounded focus:ring-[#FE6C05]"
                  />
                  <label className="ml-2 text-gray-600 text-xs">Remember Me</label>
                </div>
                <Link to={"/forgotemail"} className="text-[#FE6C05] hover:text-[#DB4437] transition-colors text-xs">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FE6C05] to-[#DB4437] text-white font-medium text-sm rounded-lg py-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign In
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg py-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
              >
                <i className="fab fa-google text-lg text-[#DB4437]"></i>
                Google
              </button>

              <p className="text-center text-gray-600 text-xs">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#FE6C05] hover:text-[#DB4437] font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

/* Add fade-in animation to global styles if not present */
// @layer utilities {
//   .animate-fade-in {
//     animation: fadeIn 0.4s ease-in;
//   }
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(-10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
// }
