import "../styling/createPost.css"
import { supabase } from '../components/supabaseClient.js'
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const CreatePost = () => {

  const[title, setTitle] = useState("");
  const[caption, setCaption] = useState("");
  const[type, setType] =useState("");
  const[genre, setGenre] = useState("");

  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();
};
const CreatePost = () => {
    return(
        <>
        <form onSubmit={handleSubmit}>
               <h1>Create a Post</h1>
            <label>Song/Album Title</label>
            <input
            value ={title}
            onChange={(e) => setTitle(e.target.value)}
            required>
            </input>
            <br />
            <label>
            Album or Song:
            </label>
             <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              disabled={loading}>
              <option value="">Select Role</option>
              <option value="Album">Album</option>
              <option value="Song">Song</option>
            </select>
            <br />
            <label>
                Genre:
            </label>
            <input
            value ={genre}
            onChange= {(e)=> setGenre(e.target.value)}>
            </input>
            <br />
            <label>
              Description:
            </label>
            <input
            value={caption}>
              value = {caption}
              onChange= {(e)=>setCaption(e.target.value)}
            </input>

            <button type="submit">Post</button>

        </form>
        </>
    )
}

export default CreatePost