import React, {useState, useEffect} from 'react';
import './styles/Navbar.css';
import axios from 'axios';
import logoImage from "./images/adpetslogo.png"
import AddPet from './addPets';

export const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');

  const navigateToLogin = () => {
    window.location.href = '/login'; 
  };

  const navigateToShelter = () => {
    window.location.href = '/registerShe'; 
  };

  const navigateToCustomer = () => {
    window.location.href = '/registerCus'; 
  };

  const navigateAddPets = () => {
    window.location.href = '/addPet'; 
  };

  const navigatePost = () => {
    window.location.href = '/post'; 
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/users/login_status');
        const { loggedIn, session } = response.data;

        if (loggedIn && session && session.username && session.userType) {
          setLoggedIn(true);
          setUsername(session.username);
          setUserType(session.userType);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/users/logout');
      setLoggedIn(false);
      setUsername('');
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };


  return (
    <nav class="nav-container">
      <ul class='navbar'>
        <li>
            <a href='/'>
                <img src={logoImage} alt='Logo' class="logo"/>
            </a>
        </li>
        <li class='left-nav'> 
          <div className='button-container'>
            {loggedIn ? (
                userType === "shelter" ? (
                  <button className="home-buttons clickable-buttons" onClick={navigateAddPets} > Add Pet</button>
                ):(
                  <button className="home-buttons clickable-buttons" onClick={navigatePost}> Add Post </button>
                  )
              ) : null}      
          </div>
        </li>
        <li class='left-nav'>
          <>
          </>
        </li>
        <li class="dropdown">
          <button class="home-buttons">{loggedIn ? `Welcome, ${username}` : 'Register'}</button>
          <div className="button-container">
            {loggedIn ? (
              <>
              </>

            ) : (
              <>
                <button className="dropdown-element clickable-buttons" onClick={navigateToCustomer}>as Customer</button>
                <button className="dropdown-element clickable-buttons" onClick={navigateToShelter}>as Shelter</button>
              </>
            )}
          </div>
        </li>
        <li className="login">
          {loggedIn ? (
            <button className="home-buttons clickable-buttons" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="home-buttons clickable-buttons" onClick={navigateToLogin}>
              Login
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
