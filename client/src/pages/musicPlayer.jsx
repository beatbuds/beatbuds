import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../styling/MusicPlayer.css'; 

// --- Helper Icons (Defined outside the component) ---
// ... (Previous/Play/Pause/Next Icon definitions here) ...
const PlayIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
);
const NextIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-280v-400l200 200-200 200Z"/></svg>
);

const PauseIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>
);
const PreviousIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M560-280 360-480l200-200v400Z"/></svg>
);




function MusicPlayer() { 
  // 1. Get required data from RootLayout via context
  const { spotifyLoggedIn, accessToken, topTracks } = useOutletContext();

  // 2. SDK Player State (using useRef to hold the player object)
  const playerRef = useRef(null); 
  const [deviceId, setDeviceId] = useState(null); // ⬅️ The key state
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);

  // --- SDK Initialization (Must be in a useEffect) ---
  useEffect(() => {
    // ... (existing useEffect logic) ...

    if (!spotifyLoggedIn || !accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'BeatBuds Web Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("SDK Ready! Device ID:", device_id);
        setDeviceId(device_id); // ⬅️ Set deviceId when ready
        playerRef.current = player;

        // Automatically transfer playback to this new device upon ready
        fetch("http://127.0.0.1:3000/api/spotify/transfer", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ device_id })
        }).catch(err => console.error("Transfer playback error:", err));
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null); // ⬅️ Clear deviceId if offline
        playerRef.current = null;
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      player.connect();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
    
  }, [spotifyLoggedIn, accessToken]); 


  // --- Control Functions ---
  const handlePlaySpecificTrack = (trackUri) => {
    if (!deviceId) return; 

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
    }).catch(err => console.error("Error starting playback:", err));
  };

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    playerRef.current.togglePlay();
  };

  const handleNextTrack = () => {
    if (!playerRef.current) return;
    playerRef.current.nextTrack();
  };
  
  const handlePreviousTrack = () => {
    if (!playerRef.current) return;
    playerRef.current.previousTrack();
  };


  if (!spotifyLoggedIn) {
    return (
      <div className="player-container">
        <h2>Please connect Spotify to use the player.</h2>
        <p>Go to the Login/Signup page to connect your account.</p>
      </div>
    );
  }
  
  const currentAlbumCover = currentTrack?.album.images[0]?.url || 'placeholder.png';
  const currentSongName = currentTrack?.name || 'Nothing Playing';
  const currentArtistNames = currentTrack?.artists.map(a => a.name).join(', ') || 'Select a track below';
  
  // New variable for better clarity in JSX
  const isPlayerReady = !!deviceId; 


  return (
    <div className="player-container">
      <h2>Music Player ({isPlayerReady ? 'Ready' : 'Connecting...'})</h2>
      
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
        
        {/* Previous Button - Disabled if not ready */}
        <button className="control-button" onClick={handlePreviousTrack} disabled={!isPlayerReady}>
            <PreviousIcon />
        </button>
        
        {/* Play/Pause Button - Disabled if not ready */}
        <button className="control-button large" onClick={handleTogglePlay} disabled={!isPlayerReady}>
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        
        {/* Next Button - Disabled if not ready */}
        <button className="control-button" onClick={handleNextTrack} disabled={!isPlayerReady}>
            <NextIcon />
        </button>

      </div>
      
      {/* Top Tracks List (Clickable to start playback) */}
      <div className="track-list">
        <h3>Your Top 5 Tracks (Click to Play)</h3>
        {isPlayerReady ? ( // Only show list if ready
            topTracks.length > 0 ? (
                <ul>
                    {topTracks.map(track => (
                    <li key={track.id} onClick={() => handlePlaySpecificTrack(track.uri)}>
                        <img src={track.album.images[2].url} alt={track.album.name} />
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
             <p className="connecting-message">Connecting player... (Ensure Spotify is open in another tab)</p>
        )}
      </div>

    </div>
  );
}

export default MusicPlayer;