import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      navigate('/LoginPage');
      return;
    }

    fetch('http://127.0.0.1:3000/api/token', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem("spotify_access_token", data.access_token);
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          navigate('/');
        } else {
          console.error(data);
          navigate('/LoginPage');
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/LoginPage');
      });
  }, []);

  return <div>Authorizing…</div>;
}

export default CallbackPage;
