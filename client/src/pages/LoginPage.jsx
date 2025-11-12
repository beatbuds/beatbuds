import {useState, useEffect} from "react";

// TODO uncomment when supabase is implemented
// import {supabase } from "../client";

import { Link } from "react-router-dom";
// import Nav from "../components/Nav";
import "../styling/LoginPage.css";
import "../index.css"

function LoginPage() {
    return(
        <>
        <div className="flex login-page">
            {/* Banner */}
            <div className="login-banner">
                <div className="flex">
                    <img src="https://images.unsplash.com/photo-1688658054075-9785303491bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" alt="" />
                </div>
                <p className="">Explore music community everywhere!</p>
            </div>

            {/* Login Form */}
            <form className="login-form">
                <div className="flex login-welcome">
                    <p>Welcome Back!</p>
                    <Link to="" className="light-txt">Forgot Password?</Link>
                </div>
                <label htmlFor="email">E-Mail</label>
                <input type="email" name="email" id="email" placeholder="jane@gmail.com" className="dark-bg"/>

                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" className="dark-bg"/>
                <button type="submit">Log In</button>
            </form>
        </div>
        </>
    );    
}

export default LoginPage;