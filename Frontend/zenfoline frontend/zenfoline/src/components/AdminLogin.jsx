import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
    <div className="flex h-screen bg-gray-100">
      <div className="w-[300px] bg-[#000042] text-white flex flex-col justify-center items-center p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm mt-2 text-gray-300 text-center">
          Manage templates, users, and more.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
        </div>

        <div className="bg-white shadow-lg rounded-lg w-[500px] p-8">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Admin Login
          </h2>

          {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <button
              type="submit"
              className="w-full bg-[#000042] text-white text-lg font-medium py-2 rounded-md hover:bg-[#000061]"
            >
              Login Now
            </button>

            <p className="text-center text-sm text-gray-600">
              Not an admin yet?{' '}
              <Link to="/adminsignup" className="text-blue-600 hover:underline">
                Signup here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
