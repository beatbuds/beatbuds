import { useState, useEffect } from 'react'
import { supabase } from '../src/components/supabaseClient.js'
import Auth from '../src/components/Auth.jsx'
import Account from '../src/components/Account.jsx'
import './styling/page-layout.css'

function App() {
  const [session, setSesion] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: {session } }) => {
      setSesion(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session)
    })
  }, [])

  return (
    <>
    <div className="container" style={{ padding: '50px 0 100px 0' }}>      
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}   
    </div>
    {/* <div class="top-container">
      <h1>beatbuds</h1>
      <h2>For music-lovers, By Music Lovers</h2>
    </div> */}

    </>
  );
}

export default App;
