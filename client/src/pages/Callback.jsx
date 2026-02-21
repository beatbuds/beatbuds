import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    const code = searchParams.get('code');
    if (!code) {
      navigate('/'); // Go back home
      return;
    }
    effectRan.current = true;

    // Send the code to our server's /api/token endpoint
    fetch('http://127.0.0.1:3000/api/token', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          // Save the tokens and go to the main page
          localStorage.setItem("spotify_access_token", data.access_token);
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          window.dispatchEvent(new Event('authChange'));
          navigate('/');
        } else {
          // Handle errors from our server
          console.error('Token exchange failed:', data);
          navigate('/');
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/');
      });
  }, [searchParams, navigate]); // Added dependencies

  return <div>Loading...</div>;
}

export default CallbackPage;