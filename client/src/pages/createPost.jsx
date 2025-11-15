import "../styling/createPost.css"


  const handleSubmit = (e) => {
    e.preventDefault();
};
const CreatePost = () => {
    return(
        <>
        <form onSubmit={handleSubmit}>
               <h1>Create a Post</h1>
            <label>Post Caption</label>
            <input
            type="text"
            required>
            </input>
            <br />
            <label>
            Song:
            </label>
            <input
            type="text"
            required></input>
            <br />
            <label>
                Image:
            </label>

              <button>Upload</button>
            <button type="submit">Post</button>

        </form>
        </>
    )
}

export default CreatePost