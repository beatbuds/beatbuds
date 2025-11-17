// [ --- App.jsx --- ]

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Aurora from './Aurora.jsx';
import './styling/page-layout.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [pfp, setPfp] = useState(null);
  const navigate = useNavigate(); 
  const currTime = new Date();
  const hour = currTime.getHours();
  const greetings = ["Good morning, ","Good Afternoon, ", "Good Evening, "]
  const handleUserData = (data) => {
    if (data.display_name) {
      setUser(data.display_name);
    }
    if (data.images && data.images[0]) {
      setPfp(data.images[0].url);
    }
  };

  const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem('spotify_refresh_token');
    if (!currentRefreshToken) {
      console.error('No refresh token available.');
      return null;
    }

    try {
      const res = await fetch('http://127.0.0.1:3000/api/refresh', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: currentRefreshToken })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Refresh token failed');
      }

      // Save the new access token
      localStorage.setItem('spotify_access_token', data.access_token);
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      
      return data.access_token;

    } catch (error) {
      console.error('Refresh failed:', error.message);
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      navigate('/LoginPage');
      return null;
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    
    if (!accessToken) {
      // Not logged in
      return;
    }

    // Main function to fetch user data
    const fetchUserData = async (token) => {
      try {
        const res = await fetch('http://127.0.0.1:3000/api/spotify/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
          // Token expired!
          console.log('Access token expired, refreshing...');
          const newAccessToken = await refreshToken();
          
          if (newAccessToken) {
            // Retry the request with the new token
            fetchUserData(newAccessToken); // Recursive call
          }
        } else if (!res.ok) {
          // Other error
          throw new Error('Failed to fetch user data');
        } else {
          // Success!
          const data = await res.json();
          handleUserData(data);
        }

      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData(accessToken);

  }, [navigate]); // Add navigate as a dependency

  return (
    <>
      <div className='w-full h-screen relative bg-black flex justify-center items-center'>
        <div style={{ width: '100%', height: '600px' }}>
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={3.9}
            amplitude={.75}
            speed={0.75}
          />
        </div>
        <div className="top-container" style={{ position: "absolute" }}>
          {user ? (
            <>
            {/* TODO: ADD CERTAIN GREETINGS BASED ON HOUR OF DAY */}
              <h1>Welcome back, {user}!</h1>
              <img src={pfp} id="ppf-container" height="200px" width="200px" alt="Profile"/>
            </>
          ) : (
            <>
              <h1>beatbuds</h1>
              <ul>
                <li>
                  <h2>for music-lovers, by music-lovers</h2>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;