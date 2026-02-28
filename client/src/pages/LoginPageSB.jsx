import {useState, useEffect} from "react";
import { supabase } from '../components/SupabaseClient.js'
import Auth from '../components/Auth.jsx'
import Account from '../components/Account.jsx'
import { useNavigate } from "react-router-dom";
import "../styling/LoginPageSB.css";
import logo from '../assets/bb.svg'
import FloatingLines from '../FloatingLines.jsx'

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
        <div style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
        <FloatingLines 
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[10, 15, 20]}
            lineDistance={[8, 6, 4]}
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
        />
        </div>
        <div className="container"style={{ position: "absolute", width:"100%"}}>
                <div className="left-container">
                    <div className="corpo-placement">
                        <div className="blur"></div>
                        <img src={logo} alt="bb-logo" className="logo-icon" />
                        <h1>beatbuds</h1>
                        <h2>for music-lovers, by music-lovers</h2>
                    </div>
                </div>
        
            <div className="right-container">
                <div className="blur"></div>
                {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
            </div>
        </div>
    </div>
    </>
    );    
}

export default LoginPageSB;