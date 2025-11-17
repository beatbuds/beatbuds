// [ --- App.jsx --- ]

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Aurora from './Aurora.jsx';
import './styling/page-layout.css';
import './App.css';

const TrackColumn = ({ track, index }) => {
    // Determine the artist string
    const artists = track.artists.map(artist => artist.name).join(', ');
    
    // Get the album cover URL
    const coverUrl = track.album.images[0]?.url || 'placeholder.png';

    return (
        // This is the container for the entire vertical column (Rank, Name, Card)
        <div className="track-column">
            
            {/* 1. Ranking and Song/Artist Info */}
            <div className="track-details">
                <span className="track-rank">#{index + 1}</span>
                <p className="track-name">{track.name}</p>
                <p className="track-artists">{artists}</p>
            </div>

            {/* 2. Album Cover Card (Set to fill the bottom space) */}
            <div 
                className="track-card"
                style={{ backgroundImage: `url(${coverUrl})` }}
            >
                {/* Optional: Overlay if needed for extra effects */}
                <div className="track-overlay"></div>
            </div>
        </div>
    );
};

function App() {
  const [user, setUser] = useState(null);
  const [pfp, setPfp] = useState(null);
  const [email,setEmail]=useState(null);
  const[top5,setTop5]=useState([]);
  const navigate = useNavigate(); 
  const currTime = new Date();
  const hour = currTime.getHours();

const getGreeting = () => {
    let message = "Hello"; // Default

    if (hour >= 5 && hour < 12) {
      message = "Good morning";
    } else if (hour >= 12 && hour < 18) {
      message = "Good afternoon";
    } else {
      // Covers 6 PM (18) through 4 AM (4)
      message = "Good evening";
    }
    return message;
  };

  const greetingMessage = getGreeting();

  const fetchTopTracks = async (accessToken) => {
    // console.log(accessToken)
      try {
          const response = await fetch('http://127.0.0.1:3000/api/spotify/top/tracks?time_range=long_term&limit=5', {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          if (!response.ok) {
              throw new Error(`Failed to fetch top tracks: ${response.status}`);
          }
          const data = await response.json();
        
          return data.items;

      } catch (error) {
          console.error("Error fetching top tracks:", error);
          return [];
      }
  };

  const handleUserData = (data, topTracks) => {
    if (data.display_name) {
      setUser(data.display_name);
    }
    if (data.images && data.images[0]) {
      setPfp(data.images[0].url);
    }
    if(data.email) {
      setEmail(data.email)
    }
    if (topTracks && topTracks.length > 0) {
      setTop5(topTracks)
      // console.log("Your top 5 tracks");
      // topTracks.forEach(track => {
      //   const artists = track.artists.map(artist => artist.name).join(', ');
      //   console.log(`${track.name} by ${artists}`);
      
    } else {
      setTop5([])
      console.log("No top tracks found.");
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
            fetchUserData(newAccessToken);
          }
        } else if (!res.ok) {
          throw new Error('Failed to fetch user data');
        } else {
          const data = await res.json();
          const topTracks = await fetchTopTracks(token);
          handleUserData(data, topTracks);
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
        <div style={{ width: '100%', height: '100%', position: "fixed" }}>
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={3.9}
            amplitude={.75}
            speed={0.75}
          />
        </div>
        <div className="container">
          <div className="top-container" style={{ position: "relative" }}>
            {user ? (
              <>
              <img src={pfp} id="ppf-container" alt="Profile"/>
              <h1>{greetingMessage}, {user}!</h1>
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
          <div className="bottom-container">
            <h2>Your Top 5 Tracks <i>(of all time!)</i></h2> 
            
            <div className="top-tracks-container">
                <div className="tracks-grid">
                    {top5.map((track, index) => (
                        <TrackColumn key={track.id} track={track} index={index} />
                    ))}
                </div>
            </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default App;