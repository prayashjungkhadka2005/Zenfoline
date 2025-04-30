import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';
import logo from '../assets/logo.png';

const AdminSignup = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
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
    setUsernameTouched(true);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailTouched(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Please fill out all fields!');
      return;
    }

    try {
      await signupAdmin(username, email, password);
      navigate('/');
    } catch (err) {
      console.error('Admin Signup failed:', err.message);
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
              Join the <span className="text-indigo-400 font-bold">Admin Team</span>
            </p>
            <p className="text-base text-gray-300 italic text-center max-w-xs mt-2">
              "Take control of your platform's future"
            </p>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="bg-[#1a1b3b]/80 backdrop-blur-md p-8 rounded-2xl w-1/2 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Signup
            </h1>
            <p className="text-gray-300 text-sm">Create your administrative account</p>
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
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    error && emailTouched && !email ? 'border-red-400' : 'border-white/10'
                  } text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                />
                {error && emailTouched && !email && (
                  <p className="text-xs text-red-400 mt-1">Email is required.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create your password"
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
              {error && username && email && password && error !== 'Please fill out all fields!' && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-medium text-sm rounded-lg py-3 transition-all duration-300 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1b3b] mt-6"
              >
                Create Admin Account
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 text-gray-400 bg-[#1a1b3b]/80">Secure Access</span>
                </div>
              </div>

              <p className="text-center text-gray-400 text-sm">
                Already an admin?{' '}
                <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
