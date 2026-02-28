import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./components/supabaseClient.js";
import Nav from './components/Nav.jsx';
import './styling/page-layout.css';
function RootLayout() {
  // --- 1. ALL STATE LIVES HERE ---
  const [session, setSession] = useState(null);
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(
    !!localStorage.getItem("spotify_access_token")
  );
  // State for Spotify user data
  const [user, setUser] = useState(null);
  const [pfp, setPfp] = useState(null);
  const [email, setEmail] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const navigate = useNavigate();

  // --- 2. ALL DATA FETCHING LIVES HERE ---
  
  // --- Greeting Logic ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning";
    if (hour >= 12 && hour < 18) return "good afternoon";
    return "good evening";
  };
  const retEmoticon = () => {
    let emoticonList = ["(●'◡'●)","\\(￣︶￣*\\))","(づ￣ 3￣)づ","（＾∀＾●）ﾉｼ","ヾ(＠⌒ー⌒＠)ノ","(〜￣▽￣)〜"];
    let randomEmote = Math.floor(Math.random() * emoticonList.length);
    return emoticonList[randomEmote];
  };

  const greetingMessage = getGreeting();
  const emote = retEmoticon();

  //get top 5 tracks 
  const fetchTopTracks = async (accessToken) => {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/spotify/top/tracks?time_range=long_term&limit=4', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch top tracks');
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      return [];
    }
  };

  const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem('spotify_refresh_token');
    if (!currentRefreshToken) return null;
    try {
      const res = await fetch('http://127.0.0.1:3000/refresh_token', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: currentRefreshToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refresh failed');
      localStorage.setItem('spotify_access_token', data.access_token);
      setAccessToken(data.access_token)
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      return data.access_token;
    } catch (error) {
      console.error('Refresh failed:', error.message);
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      setAccessToken(null)
      return null;
    }
  };

  useEffect(() => {
    //supabase auth
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

    //spotify auth listen
    const handleSpotifyAuth = () => {
      const token = localStorage.getItem("spotify_access_token");
      setAccessToken(token)
      setSpotifyLoggedIn(!!token);
      if (!token) {
        setUser(null);
        setPfp(null);
        setEmail(null);
        setTopTracks([]);
      }
    };
    window.addEventListener('authChange', handleSpotifyAuth);

    //fetch data from spotify
    const fetchAllSpotifyData = async (token) => {
      let profileData = null;
      let tracksData = [];
      try {
        const profileRes = await fetch('http://127.0.0.1:3000/api/spotify/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileRes.status === 401) {
          const newAccessToken = await refreshToken();
          if (newAccessToken) fetchAllSpotifyData(newAccessToken); //try again
          return;
        }
        if (!profileRes.ok) throw new Error('Failed to fetch user data');
        
        profileData = await profileRes.json();
        tracksData = await fetchTopTracks(token); //get top 5 tracls

        // Set all Spotify state
        if (profileData.display_name) setUser(profileData.display_name);
        if (profileData.images && profileData.images[0]) setPfp(profileData.images[0].url);
        if (profileData.email) setEmail(profileData.email);
        setTopTracks(tracksData || []);

      } catch (error) {
        console.error("Error in fetchAllData:", error.message);
      }
    };

    const accessToken = localStorage.getItem('spotify_access_token');
    if (accessToken) {
      setAccessToken(accessToken)
      setSpotifyLoggedIn(true);
      fetchAllSpotifyData(accessToken);
    } else {
      setSpotifyLoggedIn(false);
    }

    // 4. Cleanup
    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('authChange', handleSpotifyAuth);
    };
  }, [navigate]); // navigate is a dependency

// logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    window.dispatchEvent(new Event('authChange')); 
    
  };

  if (!session) {
    return <div>Loading session...</div>;
  }

  return (
    <>
      <div className="page-layout">
        <div className="nav-layout">
          <Nav
            session={session}
            spotifyLoggedIn={spotifyLoggedIn}
            handleLogout={handleLogout}
          />
        </div>
        <div className="main-content">
          <Outlet context={{
            session,
            spotifyLoggedIn,
            accessToken,
            user,
            pfp,
            email,
            topTracks,
            greetingMessage, 
            emote
          }} />
        </div>
      </div>
    </>
  );
}

export default RootLayout;