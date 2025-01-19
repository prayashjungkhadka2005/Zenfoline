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
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './authenticatedAdmin/AdminDashboard';
import AdminHome from './authenticatedAdmin/AdminHome';
import AddTemplates from './authenticatedAdmin/AddTemplates';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/registerotp" element={<RegisterOTP />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/forgotemail" element={<ForgotEmail />} />
          <Route path="/forgotpasswordotp" element={<ForgotPasswordOTP />} />
          <Route path="/adminsignup" element={<AdminSignup />} />
          <Route path="/" element={<AdminLogin />} />

          <Route path="/admindashboard" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="addtemplates" element={<AddTemplates />} />
          </Route>

        
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="templates" element={<Templates />} />
            {/* <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
