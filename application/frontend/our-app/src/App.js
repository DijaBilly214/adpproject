import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, useLocation, Link} from 'react-router-dom';
import './App.css';
import './notification.css'
import './accept.css'
import { Login } from "./Components/Login";
import  { RegisterCus }  from "./Components/registerCus";
import { RegisterShe } from "./Components/registerShe";
import {BrowsePets}  from "./Components/BrowsePets";
import {Blogs}  from "./Components/Blogs";
import {NewPost}  from "./Components/NewPost";
import {AddPet}  from "./Components/addPets";
import {forgetPassword} from "./Components/ForgotPassword"
//remove when done:
import {NewImage}  from "./Components/uploadImageSample";

import { Navbar } from "./Components/Navbar";
import petImage from "./Components/images/cat4k.png"
import blogImage from "./Components/images/blog.png"

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [selectStatus, setSelectStatus] = useState('');

  const [requestedPets, setRequestedPets] = useState([]);
  const [approvedPets, setApprovedPets] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/allApplications/pull_applications');
        setAnimals(response.data);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = animals.filter((animal) => selectStatus === '' || animal.status === selectStatus);
    setFilteredAnimals(filtered);
  }, [selectStatus, animals]);

  const handleApproval = async (applicationId, animalId, decision) => {
    try {
      console.log(`${decision} application:`, applicationId);
      
      //isssue lies here

      await axios.post('/allApplications/deal_applications', {
        id: applicationId,
        fk_aid: animalId,
        status: decision
      });

        setAnimals((prevAnimals) =>
            prevAnimals.map((animal) =>
                animal.id === applicationId ? { ...animal, status: decision } : animal
            )
        );
      } catch (error) {
      console.error(`Error ${decision} application:`, error);
    }
  };


  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('/allApplications/pull_applications');
        const allPets = response.data;
        const requestedPets = allPets.filter((pet) => pet.status === 'waiting');
        const approvedPets = allPets.filter((pet) => pet.status === 'approved');
        setRequestedPets(requestedPets);
        setApprovedPets(approvedPets);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
  
    if (loggedIn && userType === 'user') {
      fetchPets();
    }
  }, [loggedIn, userType]);

  const renderApprovalButton = (animal) => {
    if (animal.status === 'approved') {
      return (
        <button className='unclickable-button'>Approved</button>
      );
    } else {
      return (
        <>
          <button onClick={() => handleApproval(animal.application_id, animal.animal_id, 'approved')}>Approve</button>
          <button onClick={() => handleApproval(animal.application_id, animal.animal_id, 'deny')}>Deny</button>
        </>
      );
    }
  };
  

  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div class="App">
      <Navbar />
      <Routes>
        <Route path="/registerCus" element={<RegisterCus />} />
        <Route path="/registerShe" element={<RegisterShe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/PetSearch" element={<searchPet/>} />
        <Route path='/browse' element={<BrowsePets/>}/>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path='/post' element={<NewPost/>}/>
        <Route path='/uploadImageSample' element={<NewImage/>}/>
        <Route path='/addPet' element={<AddPet/>}/>
        <Route path='/passwordChange' element={<forgetPassword/>}/>
      </Routes>

      {isHomepage && loggedIn && userType === 'user' && (
        <section className='notif'>
          <h1 className='request'>Requested Pets</h1>
          <ul className='request-container'>
            {requestedPets.map((pet) => (
              <li className='pets-req' key={pet.application_id}>{pet.animalname}</li>
            ))}
          </ul>

          <h1 className='approved'>Approved Pets</h1>
          <ul className='approved-container'>
            {approvedPets.map((pet) => (
              <li className='pets-app' key={pet.application_id}>{pet.animalname}</li>
            ))}
          </ul>
        </section>
      )}

      {isHomepage && userType !== "shelter" && (
        <>
          <Link to="/browse" className="image-link">
            <section class="pet-image-container">
                <img src={petImage} alt='pet image' class="pet-image" />
                <h1 class="pet-image-text">Save a Pet, Find a Friend</h1>
            </section>
          </Link>

        <Link to="/blogs" className="image-link">
          <section class="blog-container">
            <img src={blogImage} alt='blog img' class="blog-image" />
            <h1 class="blog-text">Blog Your Experience</h1>
          </section>
        </Link>

          <footer>
            <p>&copy; 2023 Adpets.org</p>
          </footer>
        </>
      )}

      {isHomepage && loggedIn && userType === "shelter" && (
        <>
          <h1 className='sheltername'>Welcome, {username}</h1>
          <select value={selectStatus} onChange={(e) => setSelectStatus(e.target.value)}>
            <option value="waiting">All</option>
            <option value="approved">Approved</option>
          </select>

          <div className="items-grid">
            {filteredAnimals.map((animal) => (
              <div className="item" key={animal.id}>
                <p>{animal.animalname}</p>
                <p>
                  <>
                    {renderApprovalButton(animal)}
                  </>
                </p>
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
}
export default App;