import React, { createContext, useState, useEffect, useRef } from 'react';

export const SpotifyContext = createContext();

const CLIENT_ID = '19e5002ef9a94dadac0c46cd82c61307';
// Note: We use the local dev callback URL that matches the Dashboard perfectly.
const REDIRECT_URI = 'http://127.0.0.1:5173/callback'; 
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state',
  'user-read-playback-state'
];

export const SpotifyProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  // UI State
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolumeState] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);

  // PKCE Helpers
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = window.crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let _token = window.localStorage.getItem('spotify_token');

    const exchangeToken = async (authCode) => {
      const codeVerifier = window.localStorage.getItem('code_verifier');
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
          }),
        });
        const data = await response.json();
        if (data.access_token) {
          const expireTime = new Date().getTime() + data.expires_in * 1000;
          window.localStorage.setItem('spotify_token', data.access_token);
          window.localStorage.setItem('spotify_token_expires', expireTime);
          window.localStorage.setItem('spotify_refresh_token', data.refresh_token);
          window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
          setToken(data.access_token);
        }
      } catch (e) {
        console.error("Token exchange failed", e);
      }
    };

    if (code) {
      exchangeToken(code);
    } else if (_token) {
      const expireTime = window.localStorage.getItem('spotify_token_expires');
      if (expireTime && new Date().getTime() > parseInt(expireTime)) {
        logout(); // token expired
      } else {
        setToken(_token);
      }
    }
  }, []);

  // 2. Initialize Spotify Web Playback SDK when token is available
  useEffect(() => {
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const _player = new window.Spotify.Player({
        name: 'VirtualLabX Floating Player',
        getOAuthToken: cb => { cb(token); },
        volume: volume
      });

      playerRef.current = _player;
      setPlayer(_player);

      _player.addListener('ready', ({ device_id }) => {
        console.log('Spotify SDK Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      _player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });

      _player.addListener('player_state_changed', state => {
        if (!state) return;
        setIsPlaying(!state.paused);
        setCurrentTrack(state.track_window.current_track);
        setPosition(state.position);
        setDuration(state.duration);
      });

      _player.connect().then(success => {
        if (success) {
          console.log('Successfully connected to Spotify SDK!');
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auth Methods
  const login = async () => {
    const codeVerifier = generateRandomString(64);
    window.localStorage.setItem('code_verifier', codeVerifier);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.search = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    }).toString();

    window.location.href = authUrl.toString();
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem('spotify_token');
    window.localStorage.removeItem('spotify_token_expires');
    window.localStorage.removeItem('spotify_refresh_token');
    window.localStorage.removeItem('code_verifier');
    if (player) player.disconnect();
  };

  // Playback Methods
  const playTrack = async (spotify_uris, offsetIndex = 0) => {
    if (!token || !deviceId) {
      console.error('Cannot play: Token or DeviceId missing');
      return;
    }
    try {
      const urisArray = Array.isArray(spotify_uris) ? spotify_uris : [spotify_uris];
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          uris: urisArray,
          offset: { position: offsetIndex } 
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      setIsPlaying(true);
    } catch (err) {
      console.error('Playback Error', err);
    }
  };

  const togglePlayPause = async () => {
    if (!player) return;
    try {
      const state = await player.getCurrentState();
      if (!state) return;
      if (state.paused) {
        await player.resume();
        setIsPlaying(true);
      } else {
        await player.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const nextTrack = async () => { if (player) await player.nextTrack(); };
  const prevTrack = async () => { if (player) await player.previousTrack(); };
  const seekPosition = async (pos_ms) => {
    if (player) {
      await player.seek(pos_ms);
      setPosition(pos_ms);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition(p => p + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const setAppVolume = async (val) => {
    setVolumeState(val);
    if (player) {
      await player.setVolume(val);
    }
  };

  // Search Method
  const searchTracks = async (query) => {
    if (!token || !query) return [];
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      return data.tracks?.items || [];
    } catch (err) {
      console.error('Search error', err);
      return [];
    }
  };

  return (
    <SpotifyContext.Provider value={{
      token,
      isReady,
      deviceId,
      currentTrack,
      isPlaying,
      isWidgetOpen,
      setIsWidgetOpen,
      volume,
      position,
      duration,
      login,
      logout,
      playTrack,
      togglePlayPause,
      nextTrack,
      prevTrack,
      seekPosition,
      setAppVolume,
      searchTracks
    }}>
      {children}
    </SpotifyContext.Provider>
  );
};
