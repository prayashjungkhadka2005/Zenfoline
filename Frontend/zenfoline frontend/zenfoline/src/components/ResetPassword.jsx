import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import logo from "../assets/logo.png";
import useAuthStore from '../store/userAuthStore';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const setError = useAuthStore((state) => state.setError);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const email = useAuthStore((state) => state.email);
  const error = useAuthStore((state) => state.error);
  const success = useAuthStore((state) => state.success);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    useAuthStore.setState({ success: null }); 
  }, [setError]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        useAuthStore.setState({ success: null }); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success, setError]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError('Please enter the password');
      return;
    }

    try {
      await resetPassword({ email, newPassword: password });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error('Reset password failed:', err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto w-60 h-35" />
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg w-[600px] h-[360px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
            Reset Password
          </h1>
        </div>

        {success && <p className="text-green-500 text-xs text-center">{success}</p>}
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="w-full p-2 border-b-0 mx-auto">
          <form onSubmit={handleSubmit}>
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
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
