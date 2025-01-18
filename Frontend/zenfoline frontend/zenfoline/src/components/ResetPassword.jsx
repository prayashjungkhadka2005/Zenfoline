import { Link } from "react-router-dom";
import InputField from './InputField';
import logo from "../assets/logo.png";

const ResetPassword = () => {

  

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-6 w-full max-w-md">
      <img src={logo} alt="Logo" className="mx-auto  w-60 h-35" />

       
      </div>

      <div className="bg-[#F8F9FA] p-12 rounded-lg   w-[600px] h-[360px] outline-none border-2 border-[#000000]/21">
        <div className="text-center mb-3">
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
          Reset Password
        </h1>
        </div>

        <div className="w-full p-2   border-b-0 mx-auto">
          <form action="">
            <InputField label="Enter new password" placeholder="Create new password" type="text"   />
           

            

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
