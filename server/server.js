import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:5173']
}));

const TOKEN_URL = "https://accounts.spotify.com/api/token";

// exchange the authorization code for access + refresh tokens
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

// refresh the access token
app.post('/api/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token
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
    console.error("Refresh error:", e.response?.data || e.message);
    res.status(400).json({ error: "Refresh token failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://127.0.0.1:3000");
});
