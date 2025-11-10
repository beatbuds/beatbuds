import {useState,useEffect} from "react";
// import {supabase } from "../client"
import "../index.css"
import logo from '../assets/beatbudsLOGOV5.png'

function Top() {
    return (
        <>
            <div class="nav">
                <img src={logo} alt="bb-logo"></img>
                <h1>beatbuds</h1>
                <h2 a='#' >Login/SignUp</h2>
            </div>
            
        </>
    )
}

export default Top;