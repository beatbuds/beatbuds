import "../styling/profile.css"
import { useState, useEffect } from 'react' // Import useState and useEffect
import { supabase } from '../components/supabaseClient.js'
import Account from "../components/Account.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Profile() {
    const [session, setSession] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch the session on component load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session)
            } else {
                // No session found, redirect to login page
                navigate('/')
            }
        })

        // Optional: Listen for auth state changes (e.g., user logs out)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                // If user logs out, redirect to login
                navigate('/')
            } else {
                setSession(session) // Keep session in sync
            }
        });

        // Cleanup the subscription on component unmount
        return () => subscription.unsubscribe()
    }, [navigate]) // Add navigate as a dependency

    // Render a loading state or nothing while session is being fetched
    if (!session) {
        return <p>Loading...</p> // Or any loading spinner
    }

    // If session exists, render the Account
    return (
        <>
            <Account key={session.user.id} session={session} />
            
            <div className="profile-page">
                {/* Top div holds pfp, name, followers, etc. */}
                <div className="profile-top flex">
                    {/* Image div wrapper for sizing control */}
                    <div className="pfp-wrapper">
                        <img src="https://images.unsplash.com/photo-1653423954398-7a83c64049f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" alt="" />
                    </div>
                    <div className="profile-desc">
                        <div className="profile-tags flex">
                            <span className="dark-txt">Wave</span>
                            <span className="dark-txt">Jazz</span>
                            <span className="dark-txt">EDM</span>
                        </div>
                        <div className="profile-desc-top flex">
                            <h2>Jalen Williams</h2>
                            <p>1K + followers</p>
                            <p>2K + following</p>
                        </div>
                        <p>Liquid Ritual - I...</p>
                        <div>I’m Jalen Williams, a DJ blending smooth, atmospheric wave music with flowing, cinematic grooves.</div>

                    </div>

                </div>

                {/* Bottom div holds profile nav (posts, respots, likes, etc.) */}
                <div className="profile-bottom flex">
                    <div className="profile-nav">
                        <p>posts: 0</p>
                        <p>reposts: 0</p>
                        <p>likes: 0</p>
                        <p>followers: 0</p>
                    </div>

                    <div className="profile-posts flex">
                        <img src="https://f4.bcbits.com/img/a0255204882_10.jpg" alt="" />
                        <img src="https://f4.bcbits.com/img/a0885187506_10.jpg" alt="" />
                        <img src="https://f4.bcbits.com/img/a2246728404_16.jpg" alt="" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;