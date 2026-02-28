import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpotifyPlayer(accessToken) {
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!accessToken) return;
    if (window.Spotify) {
      setIsReady(true);
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsReady(true);
    };

    if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isReady || !accessToken) return;

    console.log('Initializing Spotify Player...');

    const player = new window.Spotify.Player({
      name: 'BeatBuds Music App',
      getOAuthToken: cb => {
        cb(accessToken);
      },
      volume: 0.5
    });

    player.addListener('initialization_error', ({ message }) => {
      console.error('Initialization Error:', message);
      setError(`Initialization Error: ${message}`);
    });

    player.addListener('authentication_error', ({ message }) => {
      console.error('Authentication Error:', message);
      setError(`Authentication Error: ${message}. Check your access token and scopes.`);
    });

    player.addListener('account_error', ({ message }) => {
      console.error('Account Error:', message);
      setError(`Account Error: ${message}. Spotify Premium is required.`);
    });

    player.addListener('playback_error', ({ message }) => {
      console.error('Playback Error:', message);
    });

    player.addListener('ready', ({ device_id }) => {
      console.log('Player ready with Device ID:', device_id);
      setDeviceId(device_id);
      setError(null);
      
      player.getCurrentState().then(state => {
        if (state) {
          console.log('Initial state loaded:', state);
          setCurrentTrack(state.track_window.current_track);
          setIsPaused(state.paused);
        }
      });
    });

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device has gone offline:', device_id);
      setDeviceId(null);
    });

    player.addListener('player_state_changed', state => {
      if (!state) return;
      
      console.log('State changed:', state);
      setCurrentTrack(state.track_window.current_track);
      setIsPaused(state.paused);
    });

    player.connect().then(success => {
      if (success) {
        console.log('Successfully connected to Spotify!');
        playerRef.current = player;
      } else {
        console.error('Failed to connect to Spotify');
        setError('Failed to connect. Try refreshing the page.');
      }
    });

    return () => {
      console.log('Disconnecting player...');
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, [isReady, accessToken]);

  // Control functions
  const togglePlay = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.togglePlay();
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.nextTrack();
    }
  }, []);

  const previousTrack = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.previousTrack();
    }
  }, []);

  const seek = useCallback((positionMs) => {
    if (playerRef.current) {
      playerRef.current.seek(positionMs);
    }
  }, []);

  const setVolume = useCallback((volume) => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, []);

  const refreshState = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.getCurrentState().then(state => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
          setIsPaused(state.paused);
        }
      });
    }
  }, []);

  return {
    player: playerRef.current,
    deviceId,
    isReady: !!deviceId,
    isPaused,
    currentTrack,
    error,
    controls: {
      togglePlay,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      refreshState
    }
  };
}