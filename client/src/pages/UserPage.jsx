import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../components/SupabaseClient';
import '../styling/Profile.css';

function UserPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }

      setProfile(data);
      if (data.avatar_url) downloadImage(data.avatar_url);
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (error) console.error("Error fetching posts:", error.message);
      else setPosts(data);
    };

    const downloadImage = async (path) => {
      try {
        const { data, error } = await supabase.storage.from('profile-pics').download(path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        setProfile((prev) => ({ ...prev, avatar_url: url }));
      } catch (error) {
        console.error("Error downloading image:", error.message);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [id]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-top flex">
        <div className="pfp-wrapper">
          <img src={profile.avatar_url} alt="profile" />
        </div>
        <div className="profile-desc">
          <div className="profile-tags flex">
            <span className="dark-txt">{profile.musicChoice}</span>
          </div>
          <div className="profile-desc-top flex">
            <h2>{profile.name}</h2>
          </div>
        </div>
      </div>

      <div className="profile-bottom flex">
        <div className="profile-nav">
          <p>posts: {posts.length}</p>
          <p>reposts: 0</p>
          <p>likes: 0</p>
          <p>followers: 0</p>
        </div>

        <div className="profile-posts flex">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-image">
                <img src="./public/vinyl.png" alt="vinyl" />
              </div>
              <div className="post-text">
                <h3><a href={`/post/${post.id}`}>{post.title}</a></h3>
                <p><strong>{post.type}</strong> • {post.genre}</p>
                <p>{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserPage;