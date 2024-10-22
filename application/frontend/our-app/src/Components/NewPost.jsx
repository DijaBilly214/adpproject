import React, { useState, useEffect}  from 'react';
import './styles/blogs.css';
import axios from 'axios';

export const NewPost = () => {

    const [newPost, setNewPost] = useState({
      Title: '',
      description: '',
      fk_aid:1,
      fk_sid:1, 
      fk_uid:1,
    });

    const [errMsg, setErrMsg] = useState('');

    const handleCreatePost = async (e) => {
        e.preventDefault();

        try {
          const response = await axios.post('/allPosts/create_post', newPost);

          setNewPost({
            Title: '',
            description: '',
            fk_aid:1,
            fk_sid:1, 
            fk_uid:1,
          });

        } catch (error) {
            if (!error?.response) {
                setErrMsg('Server is Not Responding');
                console.error('Error:', errMsg);
            }else {
                setErrMsg('Creating New Post Failed');
                console.error('Error:', errMsg);
            }
        }
    }

    useEffect (() =>{
        setErrMsg('');
    }, [newPost]);

  
    return (
      <div className="blog-contain">
        <h1 className="blog-title">New Post</h1>
        <form>
          <label>Title:</label>
          <input 
                type="text" 
                name="Title"
                value= {newPost.Title}
                onChange={(e) => setNewPost({...newPost, Title: e.target.value})}
                required
                />
            <br/>
  
          <label>Description:</label>
          <textarea 
                type="text"
                name="description" 
                cols="45" 
                rows="10"
                value={newPost.description} 
                onChange= {(e) => setNewPost({...newPost, description: e.target.value})}
                required
                />
            <br/>
  

          {/* <label for="file">Upload picture: </label>
          <input 
            type="file" 
            name="picture" 
            onChange={(e) => setNewPost({...newPost, picture: e.target.files[0]})}
            id="picture" 
            />
            <br/> */}

          <button class="post-button" onClick={handleCreatePost}>Create Post</button>
        </form>

      </div>
    );
  };
  
  export default NewPost;