import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import queryString from 'query-string';
import request from 'request'; // Ensure you have 'request' installed: npm install request

dotenv.config();

// 1. REAL Spotify URLs
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

var CLIENT_ID = process.env.VITE_CLIENT_ID;
var CLIENT_SECRET = process.env.VITE_CLIENT_SECRET;
// 2. DEPLOYMENT: Use the Render URL for redirect_uri if not in .env
var REDIRECT_URI = process.env.VITE_REDIRECT_URI || 'https://beatbuds.onrender.com/callback';

const app = express();
app.use(express.json());

// 3. DEPLOYMENT: Dynamic CORS Origin
const CLIENT_URL = process.env.CLIENT_URL || 'https://beatbuds.onrender.com';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  var scope = [
    'user-read-private',
    'user-read-email',
    'streaming', 
    'user-read-playback-state', 
    'user-modify-playback-state',
    'user-top-read' 
  ].join(' '); 

  // Use REAL Auth URL
  res.redirect(SPOTIFY_AUTH_URL + '?' +
    queryString.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope, 
      redirect_uri: REDIRECT_URI,
      state: state
    }));
});

app.put('/api/spotify/transfer', async (req, res) => {
    const access_token = req.headers.authorization?.split(' ')[1];
    const { device_id } = req.body;

    if (!access_token) return res.status(401).json({ error: 'No access token provided.' });
    if (!device_id) return res.status(400).json({ error: 'Missing device_id.' });

    // Use REAL Player URL
    const SPOTIFY_TRANSFER_URL = `${SPOTIFY_API_BASE}/me/player`;

    try {
        const response = await fetch(SPOTIFY_TRANSFER_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_ids: [device_id],
                play: false 
            })
        });

        if (response.status === 204) {
            return res.status(204).send();
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown Spotify transfer error' }));
            return res.status(response.status).json(errorData);
        }
    } catch (error) {
        console.error('Transfer Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with Spotify Player API.' });
    }
});

app.put('/api/spotify/play', async (req, res) => {
    const access_token = req.headers.authorization?.split(' ')[1];
    const { device_id, track_uri } = req.body;

    if (!access_token) return res.status(401).json({ error: 'No access token provided.' });
    if (!device_id || !track_uri) return res.status(400).json({ error: 'Missing device_id or track_uri.' });

    // Use REAL Play URL
    const SPOTIFY_PLAY_URL = `${SPOTIFY_API_BASE}/me/player/play?device_id=${device_id}`;

    try {
        const response = await fetch(SPOTIFY_PLAY_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uris: [track_uri] })
        });

        if (response.status === 204) {
            return res.status(200).json({ success: true });
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown Spotify error' }));
            return res.status(response.status).json(errorData);
        }
    } catch (error) {
        console.error('Playback Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with Spotify Player API.' });
    }
});

app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' + queryString.stringify({ error: 'state_mismatch' }));
  } else {
    var authOptions = {
      url: SPOTIFY_TOKEN_URL, // Use REAL Token URL
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        // DEPLOYMENT: Redirect to the Production Client URL
        res.redirect(CLIENT_URL + '/#' +
          queryString.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token
          }));
      } else {
        res.redirect(CLIENT_URL + '/#' + queryString.stringify({ error: 'invalid_token' }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: SPOTIFY_TOKEN_URL, // Use REAL Token URL
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
          refresh_token = body.refresh_token || refresh_token;
      res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
      });
    }
  });
});

app.get('/api/spotify/me', async (req, res) => {
    const access_token = req.headers.authorization?.split(' ')[1];
    if (!access_token) return res.status(401).json({ error: 'No access token provided.' });

    try {
        // Use REAL User Profile URL
        const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user data.' });
    }
});

app.get('/api/spotify/top/tracks', async (req, res) => {
    const access_token = req.headers.authorization?.split(' ')[1];
    if (!access_token) return res.status(401).json({ error: 'No access token provided.' });
    
    const { time_range = 'long_term', limit = 5 } = req.query;
    try {
        // Use REAL Top Tracks URL
        const url = `${SPOTIFY_API_BASE}/me/top/tracks?time_range=${time_range}&limit=${limit}`;
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top tracks.' });
    }
});

app.post('/api/token', async (req, res) => {
  const { code } = req.body;
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI
  });

  const authHeader = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString('base64');

  try {
    // Use REAL Token URL
    const response = await axios.post(SPOTIFY_TOKEN_URL, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${authHeader}`
      }
    });
    res.json(response.data);
  } catch (e) {
    console.error("Token exchange error:", e.response?.data || e.message);
    res.status(400).json({ error: "Token exchange failed" });
  }
});

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// 4. DEPLOYMENT: Use Process PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});