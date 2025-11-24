import {useState, useEffect} from "react";
import { supabase } from '../components/SupabaseClient.js'
import Auth from '../components/Auth.jsx'
import Account from '../components/Account.jsx'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styling/LoginPage.css";
import "../index.css"
import { useLocation } from "react-router-dom";

import Particles from './Particles.jsx';


function LoginPage() {
  const SPOTIFY_CLIENT_ID =import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  console.log("LOGIN PAGE DEBUG: REDIRECT_URI:", REDIRECT_URI);
  const SCOPES = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'user-top-read',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state'
  ];

  //to check if logged in
  const location = useLocation();
  const navigate = useNavigate();
  const currPath = location.pathname;

  const [isLoggedIn, setIsLoggedIn] = useState(
      !!localStorage.getItem("spotify_access_token") 
  );

  useEffect(() => {
      const handleAuthChange = () => {
        const token = localStorage.getItem("spotify_access_token");
        setIsLoggedIn(!!token); 
      };
      window.addEventListener('authChange', handleAuthChange);

      return () => {
        window.removeEventListener('authChange', handleAuthChange);
      };
  }, []); // see if they're logged in

  const handleLogin = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';

    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(" ")
    });

    window.location.href = `${authEndpoint}?${params.toString()}`;
  };

  return (
    <>
    {!isLoggedIn ? (
      <>
      <div className='w-full h-screen relative bg-black'>         
        <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0 }}>
            <Particles
            />
        </div>
        <div className="button-container">
            <button onClick={handleLogin}>
                connect with spotify
            </button>
        </div>
    </div>
      </>
      ) : (
      <span></span>
    )}
  </>

  );
}

export default LoginPage;
// function LoginPage() {
//       const [session, setSesion] = useState(null)
//       const navigate= useNavigate()
//         useEffect(() => {
//             supabase.auth.getSession().then(({ data: {session } }) => {
//             setSesion(session)
//             })
//             supabase.auth.onAuthStateChange((_event, session) => {
//             setSesion(session)
//             if(session){
//                 navigate('/Profile', {state: {sessionData: session}})
//             }
//         })
//         }, [session, navigate])
        
//     return(
//         <>
//         <div className="container" style={{ padding: '50px 0 100px 0' }}>      
//             {!session ? <Auth /> : <Account key={session.user.id} session={session} />}   
//         </div>

//         </>
//     );    
// }

// export default LoginPage;