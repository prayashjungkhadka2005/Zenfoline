import { Link } from "react-router-dom";
import InputField from './InputField';
import logo from "../assets/logo.png";

const Signup = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 ">
      
      <div className="text-center mb-6 w-full max-w-md">
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
          Signup for free
        </h1>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-lg w-full w-[600px]">
        
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-60 h-35" />
        </div>

        <div className="w-full p-2 my-4 border-b-0 mx-auto">
          <form action="">
            <InputField label="Email" placeholder="Email" type="email" />
            <InputField label="Password" placeholder="Password" type="password" />

         

            <button
              type="submit"
              className="w-full bg-[#FE6C05] text-white font-light text-[18px] rounded-md py-1 my-3 cursor-pointer"
            >
              Signup now
            </button>

            <p className="text-center text-[14px] pt-0 py-0">
              Already Registered?
              <Link to="/login">
                <span className="text-[black] text-[16px] px-1 cursor-pointer">
                  Login
                </span>
              </Link>
            </p>

            <button
              type="submit"
              className="w-full bg-[#DB4437] text-white font-light text-[18px] rounded-md py-2 my-3 cursor-pointer"
            >
                 Google
            </button>
            

          
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
