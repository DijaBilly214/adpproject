import React, { useEffect, useState } from 'react';
import './styles/BrowsePets.css'
import axios from 'axios';
import dogImg from "./images/dog.png"
import catImg from "./images/cat.png"
import otherImg from "./images/other.png"
import addIcon from "./images/addIcon.png"

export const BrowsePets = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('');

    const [animals, setAnimals] = useState([]);

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
        axios.get('/allAnimals')
        .then((response) => {
            setAnimals(response.data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
    }, []);


      const handleRequest = async (animalId) => {
        try {
            console.log('Requesting animal:', animalId);
            await axios.post('/allApplications/user_application', { aid: animalId });            
      
            setAnimals((prevAnimals) =>
                prevAnimals.map((animal) =>
                animal.id === animalId ? { ...animal, status: 'requested' } : animal
                )
            );
        } catch (error) {
            console.error('Error making request:', error);
        }
    };
    
    

    const [selectAnimal, setSelectAnimal] = useState('');

    const handleAnimalChange = (e) => {
        setSelectAnimal(e.target.value);
    };

    const [selectBreed, setSelectBreed] = useState('');

    const handleBreedChange = (e) => {
        setSelectBreed(e.target.value);
    };

    const [selectColor, setSelectColor] = useState('');

    const handleColorChange = (e) => {
        setSelectColor(e.target.value);
    };

    const [selectGender, setSelectGender] = useState('');

    const handleGenderChange = (e) => {
        setSelectGender(e.target.value);
    };


    return (
        <>
            {/* <div class="search-container">
                <input placeholder="Enter pet species" class="search-input" />
                <button class="search-button">Search</button>
            </div> */}

            <div class="body-container"> 
                <div class="filter-container">
                    <h2>Customize</h2>

                    <div class='filter-elem'>
                        <label class='filter-label'>Select an animal: </label>
                        <br/>
                        <select value={selectAnimal} onChange={handleAnimalChange}>
                            <option value="">All</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                        </select>
                    </div>

                    <div class='filter-elem'>
                        <label class='filter-label'>Select a breed: </label>
                        <br/>
                        <select value={selectBreed} onChange={handleBreedChange}>
                            <option value="">All</option>
                            <option value="chihuahua">Chihuahua</option>
                            <option value="pitbull">Pitbull</option>
                            <option value="golden retriever">Golden Retriever</option>
                            <option value="labrador">Labrador</option>
                        </select>
                    </div>

                    <div class='filter-elem'>
                        <label class='filter-label'>Select a color: </label>
                        <br/>
                        <select value={selectColor} onChange={handleColorChange}>
                            <option value="">All</option>
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="golden">Golden</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class='filter-elem'>
                        <label class='filter-label'>Select a gender: </label>
                        <br/>
                        <select value={selectGender} onChange={handleGenderChange}>
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                </div>
                <div class="items-container">
                    <h2>Available Animals</h2>
                    <div class="items-grid">
                        {animals
                            .filter(animal => selectAnimal === '' || animal.species === selectAnimal)
                            .filter(animal => selectBreed === '' || animal.breed === selectBreed)
                            .filter(animal => selectColor === '' || animal.color === selectColor)
                            .filter(animal => selectGender === '' || animal.gender === selectGender)
                            .map((animal) => (
                                <div class="item">
                                   {
                                //    animal.imageLink ? (
                                //         <img src={`http://localhost:3003/images/${animal.imageLink}`} alt="" class="pet-imgs" />
                                //         ) :
                                         (
                                        <img
                                            src={animal.species === 'dog' ? dogImg : animal.species === 'cat' ? catImg : otherImg}
                                            alt={animal.species}
                                            class="pet-imgs"
                                        />
                                        )}
                                    <p>Name: {animal.animalname}</p>
                                    <p>Age: {animal.age}</p>
                                    <div class="animal-comment">
                                        <p>{animal.comment}</p>
                                        {loggedIn && animal.status !== 'requested' && animal.status !== 'approved' ?  (
                                        <button onClick={() => handleRequest(animal.id)}>
                                            Request
                                        </button>
                                    ) : (
                                        <button class='unclickable-button' style={{ visibility: 'hidden' }}>
                                            {animal.status === 'approved' ? 'Approved' : 'Requested'}
                                        </button>
                                    )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrowsePets;