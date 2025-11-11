import {useState,useEffect} from "react";
// import {supabase } from "../client"
import logo from '../assets/beatbudsLOGOV5.png'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import '../styling/welcome.css'

function Top() {
    const location = useLocation();
    const currPath = location.pathname;
    return (
        <>
            <div class="nav">
                <Link to="/"><img src={logo} alt="bb-logo"></img></Link>
                <h1>beatbuds</h1>
                {currPath==='/' && (
                    <div className="flex">
                    <h2><Link to="/LoginPage" className="login-link">Login/SignUp</Link></h2>
                    <Link to="/profile" className="">Profile</Link>
                    </div>
                )}
            </div>
            <div class="spacer"></div>
        </>
    )
}

export default Top;