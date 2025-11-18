import {useState, useEffect} from "react";
import { supabase } from '../components/supabaseClient.js'
import Auth from '../components/Auth.jsx'
import Account from '../components/Account.jsx'
import { useNavigate } from "react-router-dom";
import "../styling/LoginPageSB.css";
import logo from '../assets/bb.svg'
// import "../index.css"
import Aurora from '../Aurora.jsx'

function LoginPageSB() {
      const [session, setSesion] = useState(null)
      const navigate= useNavigate()
        useEffect(() => {
            supabase.auth.getSession().then(({ data: {session } }) => {
            setSesion(session)
            })
            supabase.auth.onAuthStateChange((_event, session) => {
            setSesion(session)
            if(session){
                navigate('/HomePage', {state: {sessionData: session}})
            }
        })
        }, [session, navigate])
        
    return(
    <>
    <div className="w-full h-screen relative bg-black flex justify-center items-center">
        <div style={{ width: '100%', height: '100vh',overflow: "hidden" }}>
            <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={3.9}
            amplitude={0.75}
            speed={0.75}
            />
        </div>
        <div className="container"style={{ position: "absolute", width:"100%"}}>
            <div className="left-container">
                <img src={logo} alt="bb-logo" className="logo-icon" />
                <h1>beatbuds</h1>
                <h2>for music-lovers, by music-lovers</h2>
            </div>
        
            <div className="right-container"style={{ padding: '50px 0 100px 0' }}>
                {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
            </div>
        </div>

    </div>
    </>
    );    
}

export default LoginPageSB;