import { Link } from "react-router-dom";

const Navbar = () =>{
    return(
        <div>
        <Link to="login"><h1 className="text-3xl bg-red-300 text-center">Login</h1> </Link>
        </div>
        
    )
    }
    export default Navbar;