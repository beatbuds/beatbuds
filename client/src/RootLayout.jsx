import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./components/supabaseClient.js";
import Nav from './components/Nav.jsx';
import './styling/page-layout.css';

function RootLayout() {
  //manage states
  const [session, setSession] = useState(null);
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(
    !!localStorage.getItem("spotify_access_token")
  );
  const navigate = useNavigate();

  //all the auth logice
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/LoginPageSB');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/LoginPageSB');
      }
    });

    const handleSpotifyAuth = () => {
      const token = localStorage.getItem("spotify_access_token");
      setSpotifyLoggedIn(!!token);
    };
    window.addEventListener('authChange', handleSpotifyAuth);

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('authChange', handleSpotifyAuth);
    };
  }, [navigate]);


  //logout of supabase AND spotify
  const handleLogout = async () => {
    await supabase.auth.signOut();
    
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    
    window.dispatchEvent(new Event('authChange')); 
    
  };

  //loading....
  if (!session) {
    // You can replace this with a dedicated loading spinner component
    return <div>Loading...</div>; 
  }

  //session in place, render.
  return (
    <>
      <div className="page-layout">
        <div className="nav-layout">
          {/* Pass all state and functions down to Nav as props */}
          <Nav
            session={session}
            spotifyLoggedIn={spotifyLoggedIn}
            handleLogout={handleLogout}
          />
        </div>
        <div className="main-content">
          {/* Pages (Profile, Fyp, etc.) will be rendered here */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default RootLayout;