import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSpotifyPlayer } from '../components/spotifyPlayer.js';
import '../styling/MusicPlayer.css'; 

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
    <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
  </svg>
);

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
    <path d="M400-280v-400l200 200-200 200Z"/>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
    <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/>
  </svg>
);

const PreviousIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
    <path d="M560-280 360-480l200-200v400Z"/>
  </svg>
);

function MusicPlayer() { 
  const { spotifyLoggedIn, accessToken, topTracks } = useOutletContext();

  // Use the custom Spotify hook
  const { 
    deviceId, 
    isReady, 
    isPaused, 
    currentTrack, 
    error,
    controls 
  } = useSpotifyPlayer(spotifyLoggedIn ? accessToken : null);

  // Transfer playback to this device when ready
  useEffect(() => {
    if (deviceId && accessToken) {
      console.log('Transferring playback to device:', deviceId);
      
      fetch("http://127.0.0.1:3000/api/spotify/transfer", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ device_id: deviceId })
      })
      // --- FIX 4: Handle the 204 No Content response ---
      .then(res => {
        if (res.status === 204) {
          console.log('Playback transferred successfully.');
          return; // Success, but no JSON body to parse
        }
        if (!res.ok) {
          // If there's an error, try to parse it as JSON
          return res.json().then(err => { 
            throw new Error(err.error || 'Failed to transfer playback') 
          });
        }
        return res.json(); // For any other 2xx response
      })
      .then(data => {
        if (data) { // Only log if data is not undefined
          console.log('Playback transferred response:', data);
        }
      })
      .catch(err => console.error("Transfer playback error:", err.message));
    }
  }, [deviceId, accessToken]);

  // Play a specific track
  const handlePlaySpecificTrack = (trackUri) => {
    if (!deviceId || !accessToken) {
      console.error('No device ID or access token available');
      return;
    }

    console.log('Playing track:', trackUri);

    fetch('http://127.0.0.1:3000/api/spotify/play', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        device_id: deviceId,
        track_uri: trackUri 
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || 'Failed to play track');
        });
      }
      return res.json();
    })
    .then(data => console.log('Playback started:', data))
    .catch(err => console.error("Error starting playback:", err));
  };

  // Handle case when not logged in
  if (!spotifyLoggedIn) {
    return (
      <div className="player-container">
        <h2>Please connect Spotify to use the player.</h2>
        <p>Go to the Login/Signup page to connect your account.</p>
      </div>
    );
  }

  // Handle SDK errors
  if (error) {
    return (
      <div className="player-container">
        <h2>Spotify Player Error</h2>
        <p style={{ color: '#ff4444', marginBottom: '20px' }}>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  const currentAlbumCover = currentTrack?.album.images[0]?.url || 'placeholder.png';
  const currentSongName = currentTrack?.name || 'Nothing Playing';
  const currentArtistNames = currentTrack?.artists.map(a => a.name).join(', ') || 'Select a track below';

  return (
    <div className="player-container">
      <h2>Music Player ({isReady ? 'Ready' : 'Connecting...'})</h2>
      
      {/* Album Container */}
      <div className="album-container">
        <img 
          src={currentAlbumCover} 
          alt="Current Album Cover" 
          className="now-playing-cover"
        />
        <div className="now-playing-info">
          <div className="now-playing-name">{currentSongName}</div>
          <div className="now-playing-artist">{currentArtistNames}</div>
        </div>
      </div>

      {/* Music Control Container */}
      <div className="music-control-container">
        <button 
          className="control-button" 
          onClick={controls.previousTrack} 
          disabled={!isReady}
        >
          <PreviousIcon />
        </button>
        
        <button 
          className="control-button large" 
          onClick={controls.togglePlay} 
          disabled={!isReady}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        
        <button 
          className="control-button" 
          onClick={controls.nextTrack} 
          disabled={!isReady}
        >
          <NextIcon />
        </button>
      </div>
      
      {/* Top Tracks List */}
      <div className="track-list">
        <h3>Your Top 5 Tracks (Click to Play)</h3>
        {isReady ? (
          topTracks && topTracks.length > 0 ? (
            <ul>
              {topTracks.map(track => (
                <li 
                  key={track.id} 
                  onClick={() => handlePlaySpecificTrack(track.uri)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={track.album.images[2]?.url} alt={track.album.name} />
                  <div className="track-list-info">
                    <div className="track-list-name">{track.name}</div>
                    <div className="track-list-artist">
                      {track.artists.map(a => a.name).join(', ')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Go to Home Page first to load your Top Tracks.</p>
          )
        ) : (
          <p className="connecting-message">
            Connecting player... (Ensure you have Spotify Premium and the required scopes)
          </p>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;