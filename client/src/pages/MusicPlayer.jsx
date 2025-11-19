import React, { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSpotifyPlayer } from '../components/spotifyPlayer.js';
import '../styling/MusicPlayer.css'; 

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="72px" viewBox="0 -960 960 960" width="72px" fill="#e3e3e3">
    <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
  </svg>
);

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="72px" viewBox="0 -960 960 960" width="72px" fill="#e3e3e3">
    <path d="M400-280v-400l200 200-200 200Z"/>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="72px" viewBox="0 -960 960 960" width="72px" fill="#e3e3e3">
    <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/>
  </svg>
);

const PreviousIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="72px" viewBox="0 -960 960 960" width="72px" fill="#e3e3e3">
    <path d="M560-280 360-480l200-200v400Z"/>
  </svg>
);

function MusicPlayer() { 
  const { spotifyLoggedIn, accessToken, topTracks } = useOutletContext();
  const { 
    deviceId, 
    isReady, 
    isPaused, 
    currentTrack, 
    error,
    controls 
  } = useSpotifyPlayer(spotifyLoggedIn ? accessToken : null);
  const navigate = useNavigate();
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
      .then(res => {
        if (res.status === 204) {
          console.log('Playback transferred successfully.');
          return; 
        }
        if (!res.ok) {
          return res.json().then(err => { 
            window.location.reload();
            throw new Error(err.error || 'Failed to transfer playback') 
          });
        }
        return res.json(); 
      })
      .then(data => {
        if (data) {
          console.log('Playback transferred response:', data);
        }
      })
      .catch(err => console.error("Transfer playback error:", err.message));
    }
  }, [deviceId, accessToken]);

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
    <div className="general-container" style={{'--album-cover': `url(${currentAlbumCover})`}}>
      <div className="player-container">
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
      </div>
      </div>
  );
}

export default MusicPlayer;