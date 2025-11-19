import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../components/SupabaseClient';
import '../styling/PostDetails.css';
const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

const navigate = useNavigate();
  const handleDelete = async () => {
  const confirm = window.confirm("Are you sure you want to delete this post?");
  if (!confirm) return;

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', post.id);

  if (error) {
    console.error("Error deleting post:", error.message);
    alert("Delete failed.");
  } else {
    alert("Post deleted.");
    navigate("/Profile");
  }
};

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error("Error fetching post:", error.message);
      else setPost(data);
    };

    fetchPost();
  }, [id]);

  console.log("Post ID from params:", id);
  if (!post) return <p>Loading post...</p>;

  return (
    <div className="Container">
        <div className="text">
      <h2>{post.title}</h2>
      <p>{post.caption}</p>
      <p><strong>{post.type}</strong> • {post.genre}</p>
      <button onClick={handleDelete}>Delete Post</button>
      </div>
    </div>
  );
};

export default PostDetails;