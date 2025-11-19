import "../styling/createPost.css";
import { supabase } from '../components/supabaseClient.js';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [type, setType] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  const { session, spotifyLoggedIn, handleLogout } = useOutletContext();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          caption,
          type,
          genre,
          user_id: session.user.id,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error("Error creating post:", error.message);
      alert("Failed to create post.");
    } else {
      alert("Post created!");
      navigate("/Profile"); // or wherever you want to redirect
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a Post</h1>

      <label>Song/Album Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />

      <label>Album or Song:</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        disabled={loading}
      >
        <option value="">Select Type</option>
        <option value="Album">Album</option>
        <option value="Song">Song</option>
      </select>
      <br />

      <label>Genre:</label>
      <input
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
      />
      <br />

   <label>Description:</label>
<textarea
  value={caption}
  onChange={(e) => {
    const input = e.target.value;
    if (input.length <= 120) {
      setCaption(input);
    }
  }}
  required
/>
<p>{caption.length}/120 characters</p>
      <br />

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;