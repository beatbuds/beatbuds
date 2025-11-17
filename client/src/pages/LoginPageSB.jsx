import {useState, useEffect} from "react";
import { supabase } from '../components/supabaseClient.js'
import Auth from '../components/Auth.jsx'
import Account from '../components/Account.jsx'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styling/LoginPageSB.css";
import "../index.css"

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
                navigate('/Profile', {state: {sessionData: session}})
            }
        })
        }, [session, navigate])
        
    return(
        <>
        <div className="container" style={{ padding: '50px 0 100px 0' }}>      
            {!session ? <Auth /> : <Account key={session.user.id} session={session} />}   
        </div>
        </>
    );    
}

export default LoginPageSB;