import Account from "../components/Account.jsx";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase} from '../components/supabaseClient.js'
import '../styling/settings.css'

function Settings() {
    const [session, setSession] = useState(null)
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session)
            } else {
                // No session found, redirect to login page
                navigate('/')
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/')
            } else {
                setSession(session) 
            }
        });

        return () => subscription.unsubscribe()
    }, [navigate]) 

    if (!session) {
        return <p>Loading...</p> // load load load
    }

    async function downloadImage(path) {
        try {
        const { data, error } = await supabase.storage.from('profile-pics').download(path)
        if (error) {
            throw error
        }
        const url = URL.createObjectURL(data)
        setProfile(prev => ({...prev, avatar_url: url}))
        } catch (error) {
        console.log('Error downloading image: ', error.message)
        }
    }

    async function onProfileLoaded(profile, path){
        setProfile(profile);
        downloadImage(path);
    }
    return (
        <>
            <Account key={session.user.id} session={session} onProfileLoaded={onProfileLoaded}/>
        </>
    );
}

export default Settings;