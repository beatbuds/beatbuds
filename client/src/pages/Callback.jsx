// pages/CallbackPage.jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function CallbackPage() {
  // React Router hook to read URL query parameters
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code'); // Get the 'code' from URL

    if (code) {
      // Send this code to your backend server
      fetch('http://localhost:3000/api/token', { // Assuming backend is on port 3000
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      .then(res => res.json())
      .then(data => {
        // Backend sends back tokens. Save them!
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_refresh_token', data.refresh_token);

        // Redirect to the main app page
        navigate('/'); 
      })
      .catch(error => {
        console.error('Error fetching tokens:', error);
        navigate('/LoginPage'); // Send back to login on error
      });
    }
  }, [searchParams, navigate]);

  return (
    <div>Loading...</div> // Show a loading indicator
  );
}
export default CallbackPage;