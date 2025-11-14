import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import Avatar from './Avatar.jsx'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState(null)
  const [musicChoice, setMusicChoice] = useState(null)
  const [isPrivate, setIsPrivate] = useState(false) // State for the boolean
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session

      // Updated select query for the new fields
      const { data, error } = await supabase
        .from('users') // Assuming you're still using the 'users' table
        .select(`name, private, musicChoice, avatar_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          // Set the new state variables
          setName(data.name)
          setIsPrivate(data.private)
          setMusicChoice(data.musicChoice)
          setAvatarUrl(data.avatar_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event, avatarUrl) {
    // This function will be called by *either* the form submit or the Avatar upload
    // If it's a form submit, event will be defined and avatarUrl will be undefined
    // If it's an avatar upload, event and avatarUrl will be defined
    
    if (event) {
        event.preventDefault()
    }

    setLoading(true)
    const { user } = session

    // Use the 'avatarUrl' from the argument if it exists (from Avatar component),
    // otherwise use the one from state (from form submit)
    const finalAvatarUrl = avatarUrl || avatar_url

    const updates = {
      id: user.id,
      name,
      private: isPrivate,
      musicChoice: musicChoice,
      avatar_url: finalAvatarUrl,
    }

    const { error } = await supabase.from('users').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      // Make sure state is updated if avatar was changed
      setAvatarUrl(finalAvatarUrl)
      alert('Profile updated successfully!')
    }
    setLoading(false)
  }

  return (
    // Pass the main updateProfile function to onSubmit
    <form onSubmit={updateProfile} className="form-widget">
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(event, url) => {
          // When avatar is uploaded, call updateProfile directly
          // This saves the avatar *immediately*
          updateProfile(event, url)
        }}
      />
    
      {/* Email (disabled) */}
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>

      {/* Name (was username) */}
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          required
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Music Choice (new) */}
      <div>
        <label htmlFor="musicChoice">Music Choice</label>
        <input
          id="musicChoice"
          type="text"
          value={musicChoice || ''}
          onChange={(e) => setMusicChoice(e.target.value)}
        />
      </div>
      
      {/* Private (new) */}
      <div>
        <label htmlFor="private">Private Account</label>
        <input
          id="private"
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
      </div>

      {/* Update Button */}
      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update Profile'}
        </button>
      </div>

      {/* Sign Out Button */}
      <div>
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  )
}