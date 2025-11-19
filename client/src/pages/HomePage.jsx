import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Aurora from '../Aurora.jsx';
import '../styling/PageLayout.css';
import '../styling/HomePage.css';
import { useOutletContext } from "react-router-dom";

const TrackColumn = ({ track, index }) => {
    // Determine the artist string
    const artists = track.artists.map(artist => artist.name).join(', ');
    
    // Get the album cover URL
    const coverUrl = track.album.images[0]?.url

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

function HomePage() {
    const {
      session,
      spotifyLoggedIn,
      accessToken,
      user,
      pfp,
      email,
      topTracks,
      greetingMessage
  } = useOutletContext();

  const navigate = useNavigate(); 
  // console.log(topTracks)
  const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem('spotify_refresh_token');
    if (!currentRefreshToken) {
      console.error('No refresh token available.');
      return null;
    }

    try {
      const res = await fetch('https://beatbuds.onrender.com/refresh_token', {
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
        <div className="user-container">
          <div className="top-user-container" style={{ position: "relative" }}>
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
          {spotifyLoggedIn && (
          <div className="bottom-user-container">
            <h2>Your Top 5 Tracks <i>(of all time!)</i></h2> 
            <div className="top-tracks-container">
                <div className="tracks-grid">
                    {topTracks.map((track, index) => (
                        <TrackColumn key={track.id} track={track} index={index} />
                    ))}
                </div>
            </div>
          </div>
          )}
        </div>
        
      </div>
    </>
  );
}

export default HomePage;