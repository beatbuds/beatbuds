import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./components/supabaseClient.js"; // Make sure this path is correct
import Nav from './components/Nav.jsx'; // Make sure this path is correct
import './styling/page-layout.css';

function RootLayout() {
  // --- State Management ---
  const [session, setSession] = useState(null);
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(
    !!localStorage.getItem("spotify_access_token")
  );
  const navigate = useNavigate();

  // --- Auth Logic ---
  useEffect(() => {
    // 1. Check for Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/LoginPageSB');
      }
    });

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/LoginPageSB');
      }
    });

    // 2. Check for Spotify Token
    const handleSpotifyAuth = () => {
      const token = localStorage.getItem("spotify_access_token");
      setSpotifyLoggedIn(!!token);
    };
    window.addEventListener('authChange', handleSpotifyAuth);

    // 3. Cleanup
    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('authChange', handleSpotifyAuth);
    };
  }, [navigate]); // Only run when navigate function is available

  // --- Logout Function ---
  const handleLogout = async () => {
    // 1. Sign out of Supabase
    await supabase.auth.signOut();
    
    // 2. "Log out" of Spotify
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    
    // 3. Manually dispatch event
    window.dispatchEvent(new Event('authChange')); 
    
    // 4. State will be set to null by listeners,
    // which will trigger the redirect in the useEffect
  };

  // --- Loading Check ---
  // Don't render the layout if we're still checking the session or redirecting
  if (!session) {
    // You can replace this with a dedicated loading spinner component
    return <div>Loading session...</div>; 
  }

  // --- Render ---
  // We have a session, so render the full app layout
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