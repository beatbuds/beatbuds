import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import '../styling/EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error("Error fetching post:", error.message);
      else {
        setTitle(data.title);
        setCaption(data.caption);
        setType(data.type);
        setGenre(data.genre);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('posts')
      .update({ title, caption, type, genre })
      .eq('id', id);

    setLoading(false);

    if (error) {
      console.error("Error updating post:", error.message);
      alert("Update failed.");
    } else {
      alert("Post updated!");
      navigate(`/post/${id}`);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h1>Edit Post</h1>
      <label>Song/Album Title:</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <br />
            <label>Description</label>
      <textarea value={caption} onChange={(e) => setCaption(e.target.value)} required />
              <br />
              <label>Song or Album:</label>
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="">Select Type</option>
        <option value="Album">Album</option>
        <option value="Song">Song</option>
      </select>
            <br />
            <label>Genre:</label>
      <input value={genre} onChange={(e) => setGenre(e.target.value)} required />
            <br />
      <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Post"}</button>
    </form>
  );
};

export default EditPost;