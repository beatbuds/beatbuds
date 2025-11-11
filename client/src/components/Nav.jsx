import {useState,useEffect} from "react";
// import {supabase } from "../client"
import logo from '../assets/beatbudsLOGOV5.svg'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import '../styling/welcome.css'
import '../index.css'

function Top() {
    const location = useLocation();
    const currPath = location.pathname;
    return (
        <>
            <div class="nav">
                
                <ul>
                    <li class="active">
                        {/* <img src={logo} alt="bb-logo"></img> */}
                        <svg class="icon">
                            <use href={logo}></use>
                        </svg>

                        <Link to="/">beatbuds</Link> {/* Home */}
                    </li>

                    <li class="active">
                        <Link to="/LoginPage">Login/Signup</Link> {/* LoginPage */}
                    </li>

                    <li class="active">
                        <Link to="/MusicPlayer">Music Player</Link> {/* Music Player */}
                    </li>

                    <li class="active">
                        <Link to="/Profile">Profile</Link> {/* Profile */}
                    </li>

                    <li class="active">
                        <Link to="/Settings">Settings</Link> {/* Settings */}
                    </li>

                    <li class="active">
                        <Link to="/Communities">Communities</Link> {/* Communities */}
                    </li>

                    <li class="active">
                        <Link to="/Fyp">fyp</Link> {/* Fyp */}
                    </li>
                    
                </ul>
                
                
                {/* <h1>beatbuds</h1> */}

                {/* {currPath==='/' && (
                    <h2><Link to="/LoginPage" className="login-link">Login/SignUp</Link></h2>
                )} */}
            </div>
            <div class="spacer"></div>
        </>
    )
}

export default Top;