import {useState, useEffect} from "react";
import { supabase } from '../components/supabaseClient.js'
import Auth from '../components/Auth.jsx'
import Account from '../components/Account.jsx'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styling/LoginPage.css";
import "../index.css"

// LoginPage.jsx

function LoginPage() {
  const CLIENT_ID = '1bfbd90b689e4b539d1a3ddb4f07bb25';
  const REDIRECT_URI = 'http://127.0.0.1:5173/callback'; // Must match your Spotify Dashboard
  const SCOPES = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    // Add any other scopes your "beatbuds" app needs
  ];

  const handleLogin = () => {
    // Construct the Spotify authorization URL
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(' '),
    });

    // Redirect the user to Spotify
    window.location.href = `${authEndpoint}?${params.toString()}`;
  };

  return (
    <div>
      {/* You can style this button however you like, 
        but its onClick will trigger the redirect. 
      */}
      <button onClick={handleLogin}>
        Login with Spotify
      </button>
    </div>
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