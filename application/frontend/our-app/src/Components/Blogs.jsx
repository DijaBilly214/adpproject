import React, { useState, useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/blogs.css';
import axios from 'axios';
import addIcon from "./images/addIcon.png"

export const Blogs = () => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);

  const navigateToNewPost = () => {
    window.location.href = '/post'; 
  };

  useEffect(() => {
    axios.get('/allPosts')
      .then((response) => {
        setBlogPosts(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/users/login_status');
        const { loggedIn, session } = response.data;

        if (loggedIn && session && session.username) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, []);

  

  return (
    <div className="blog-contain">
      <h1 className="blog-title">Blogs</h1>
      {loggedIn ? (
        <>
        <button class="addbtn" type="submit" onClick={navigateToNewPost}><img src={addIcon} alt='addButton' class=""/></button>
        </>
        ) : (
        <>
        </>
      )}
      <div className="blog-posts">
          {blogPosts.map((post) => (
            <div className="blog-post">
              <h2 className="post-title">{post.Title}</h2>
              <p className="post-createdat">{new Date(post.created_at).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              </p>
              <p className="post-content">{post.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Blogs;