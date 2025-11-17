import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import queryString from 'query-string'

dotenv.config();

const TOKEN_URL = "https://accounts.spotify.com/api/token";

var CLIENT_ID=process.env.VITE_CLIENT_ID;
var CLIENT_SECRET=process.env.VITE_CLIENT_SECRET;
var REDIRECT_URI = process.env.VITE_REDIRECT_URI;

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5173'
}));

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    }));
});

app.get('/callback', function(req, res) {s

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
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
  }
});

app.get('/refresh_token', function(req, res) {

  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
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

    if (!access_token) {
        return res.status(401).json({ error: 'No access token provided.' });
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me', { // Assuming this is https://api.spotify.com/v1/me
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        // IMPORTANT: Get the JSON body from the response
        const data = await response.json();

        // Check if the response was NOT okay (e.g., 401, 403, 404)
        if (!response.ok) {
            console.error('Spotify API Error:', data);
            // Forward Spotify's error status and message to the client
            return res.status(response.status).json(data);
        }

        // Success! Send the data.
        res.json(data);

    } catch (error) {
        console.error('Spotify API Proxy Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch user data from Spotify.' });
    }
});

app.post('/api/token', async (req, res) => {
  const { code } = req.body;

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.VITE_REDIRECT_URI
  });

  const authHeader = Buffer.from(
    `${process.env.VITE_CLIENT_ID}:${process.env.VITE_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post(TOKEN_URL, params.toString(), {
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

app.listen(3000, () => {
  console.log("Server running on http://127.0.0.1:3000");
});

