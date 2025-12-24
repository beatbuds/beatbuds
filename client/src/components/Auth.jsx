import { useState } from 'react'
import { supabase } from './supabaseClient.js'
import '../styling/LoginPageSB.css' 

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      {/* Banner */}
      {/* <div className="login-banner">
        <div className="flex">
          <img
            src="https://images.unsplash.com/photo-1688658054075-9785303491bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
            alt="Music community banner"
          />
        </div>
        <p className="">Explore music community everywhere!</p>
      </div> */}

      {/* Login Form */}
      <form class="auth-form" onSubmit={handleLogin}>
        {/* <div className="flex login-welcome">
          <p>Welcome Back!</p>
        </div> */}
        
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="jane@gmail.com"
          className="dark-bg"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
        <button className={'button block'} disabled={loading}>
          {loading ? <span>Loading...</span> : <span>Send login link</span>}
        </button>
        </div>
      </form>
    </div>
  )
}