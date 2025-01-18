import Signup from './components/Signup';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterOTP from './components/RegisterOTP';
import ResetPassword from './components/ResetPassword';
import Dashboard from './AuthenticatedUser/dashboard';
import ForgotEmail from './components/ForgotEmail';
import ForgotPasswordOTP from './components/ForgotPasswordOTP';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/registerotp" element={<RegisterOTP />} />
          <Route path='/resetpassword' element={<ResetPassword />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/forgotemail' element={<ForgotEmail />}/>
          <Route path='/forgotpasswordotp' element={<ForgotPasswordOTP />}/>
          <Route path='/resetpassword' element={<ResetPassword />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
