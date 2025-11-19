import "../styling/Profile.css"
import { useState, useEffect } from 'react' // Import useState and useEffect
import { supabase } from '../components/SupabaseClient.js'
import Account from "../components/Account.jsx";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate

function Profile() {
    const [session, setSession] = useState(null)
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null);
    const[posts,setPosts] = useState([]);


    async function getPosts() {
    try {
        const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
    } catch (error) {
        console.error("Error fetching posts:", error.message);
    }
    }
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session)
            } else {
                // No session found, redirect to login page
                navigate('/LoginPageSB')
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/HomePage')
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
        getPosts();
    }
    // If session exists, render the Account
    return (
        <>
            {
            profile ? 
            <div className="profile-page">
                {/* Top div holds pfp, name, followers, etc. */}
                <div className="profile-top flex">
                    {/* Image div wrapper for sizing control */}
                    <div className="pfp-wrapper">
                        <img src={profile.avatar_url} alt="" />
                    </div>
                    <div className="profile-desc">
                        <div className="profile-tags flex">
                            <span className="dark-txt">{profile.musicChoice}</span>
                        </div>
                        <div className="profile-desc-top flex">
                            <h2>{profile.name}</h2>
                        </div>
                         <Link className="post-button" to="/createPost">Create Post</Link>

                        {/* <p>Liquid Ritual - I...</p>
                        <div>I’m Jalen Williams, a DJ blending smooth, atmospheric wave music with flowing, cinematic grooves.</div> */}
                    </div>
                </div>

                {/* Bottom div holds profile nav (posts, respots, likes, etc.) */}
                <div className="profile-bottom flex">
                    <div className="profile-nav">
                             <p>posts: {posts.length}</p>
                    </div>

             <div className="profile-posts flex">
  {posts.length > 0 ? (
    posts.map((post) => (
      <div key={post.id} className="post-card">
        <div className="post-image">
          <img src="./public/vinyl.png" alt="vinyl" />
        </div>
        <div className="post-text">
          <h3>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
               <Link to={`/edit/${post.id}`}>Edit</Link>
          </h3>
          <p><strong>{post.type}</strong> • {post.genre}</p>
          <p>{post.caption}</p>
        
        </div>
      </div>
    ))
  ) : (
    <p>No posts yet.</p>
  )}
</div>
                </div>
            </div>
            :
            <>Loading profile...</>
            }

            <Account key={session.user.id} session={session} onProfileLoaded={onProfileLoaded}/>
        </>
    );
}

export default Profile;