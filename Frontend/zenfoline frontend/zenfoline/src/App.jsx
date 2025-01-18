import Signup from './components/Signup';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterOTP from './components/RegisterOTP';
import ResetPassword from './components/ResetPassword';
import ForgotEmail from './components/ForgotEmail';
import ForgotPasswordOTP from './components/ForgotPasswordOTP';
import Dashboard from './authenticatedUser/Dashboard';
import Home from './authenticatedUser/Home';
import Templates from './authenticatedUser/Templates';
// Import other dashboard-related pages as needed

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/registerotp" element={<RegisterOTP />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/forgotemail" element={<ForgotEmail />} />
          <Route path="/forgotpasswordotp" element={<ForgotPasswordOTP />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            {/* Uncomment and add other dashboard pages as needed */}
            <Route path="templates" element={<Templates />} />
            {/* <Route path="appearance" element={<Appearance />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
