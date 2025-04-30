import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';
import InputField from './InputField';
import logo from '../assets/logo.png';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const setError = useAuthStore((state) => state.setError);
  const adminLogin = useAuthStore((state) => state.adminLogin); 
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    setError(null);
  }, [setError]);

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
    setUsernameTouched(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill out all fields!');
      return;
    }

    try {
      await adminLogin(username, password); 
      navigate('/admindashboard');
    } catch (err) {
      console.error('Admin Login failed:', err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-[#000042]">
      <div className="flex items-center justify-center w-full max-w-5xl gap-8 px-4">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center w-1/2 h-[500px] relative overflow-hidden">
          {/* Abstract SVG background */}
          <svg className="absolute -top-16 -left-24 w-[500px] h-[500px] opacity-20 z-0" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="250" cy="250" rx="250" ry="200" fill="url(#paint0_radial)" />
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(250 250) scale(250 200)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5" stopOpacity="0.3" />
                <stop offset="1" stopColor="#000042" stopOpacity="0.1" />
              </radialGradient>
            </defs>
          </svg>
          {/* Glassmorphism card */}
          <div className="relative z-10 flex flex-col items-center backdrop-blur-md bg-[#1a1b3b]/80 border border-white/20 rounded-2xl shadow-lg px-10 py-12">
            <div className="bg-white rounded-xl p-4 mb-6">
              <img src={logo} alt="Logo" className="mx-auto w-60 h-auto" />
            </div>
            <p className="text-xl text-white font-semibold text-center max-w-xs mb-2">
              Welcome to the <span className="text-indigo-400 font-bold">Admin Portal</span>
            </p>
            <p className="text-base text-gray-300 italic text-center max-w-xs mt-2">
              "Manage your platform with confidence and control"
            </p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="bg-[#1a1b3b]/80 backdrop-blur-md p-8 rounded-2xl w-1/2 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-gray-300 text-sm">Access your administrative dashboard</p>
            {message && (
              <div className="text-red-400 text-center mt-2 font-medium animate-fade-in">
                {message}
              </div>
            )}
          </div>

          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    error && usernameTouched && !username ? 'border-red-400' : 'border-white/10'
                  } text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                />
                {error && usernameTouched && !username && (
                  <p className="text-xs text-red-400 mt-1">Username is required.</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    error && passwordTouched && !password ? 'border-red-400' : 'border-white/10'
                  } text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                />
                {error && passwordTouched && !password && (
                  <p className="text-xs text-red-400 mt-1">Password is required.</p>
                )}
              </div>

              {/* Backend error message */}
              {error && username && password && error !== 'Please fill out all fields!' && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-white/10 border-white/20 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <label className="ml-2 text-white/80 text-sm">Remember Me</label>
                </div>
                <Link to="/admin/forgot-password" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-medium text-sm rounded-lg py-3 transition-all duration-300 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1b3b] mt-6"
              >
                Login to Admin Panel
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 text-gray-400 bg-[#1a1b3b]/80">Secure Access</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-center text-gray-400 text-sm">
                  Need admin access?{' '}
                  <Link to="/adminsignup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Register here
                  </Link>
                </p>
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
