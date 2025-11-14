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
        </>
    );
}

export default Profile;