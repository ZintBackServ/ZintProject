import React from "react";
import {Link} from "react-router-dom"
 
function Navbar() {
        return(
            <nav className="text-xl  text-black bg-gradient-to-r from-amber-100 to-rose-300 flex justify-between p-3" >

                <Link to="#" className="bg-orange-400 text-white px-1 rounded font-semibold" >ZI </Link>

                <ul className="flex place-content-between gap-5" >
                    <li className="px-2 rounded-xl font-semibold hover:bg-black hover:text-white">
                        <Link to="/" >Home</Link>
                    </li>
                    <li className="px-2 rounded-xl font-semibold hover:bg-black hover:text-white">
                        <Link to="/About" >About</Link>
                    </li>
                    <li className="px-2 rounded-xl font-semibold hover:bg-black hover:text-white">
                        <Link to="/Courses" >Courses</Link>
                    </li>
                    <li className="px-2 rounded-xl font-semibold hover:bg-black hover:text-white">
                        <Link to="/Events" >Events</Link>
                    </li>
                    <li className="px-2 rounded-xl font-semibold hover:bg-black hover:text-white">
                        <Link to="/Login" >Login</Link>
                    </li>
                    
                </ul>
            </nav>
        )   
}
export default Navbar;