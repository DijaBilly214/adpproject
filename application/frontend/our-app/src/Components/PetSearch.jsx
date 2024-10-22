import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const  PetSearch =() =>{

    const [backendData, setBackendData] = useState([{}]);
    const [species, setSpecies] = useState('');
    
    const handleChange = async () =>{
        try {
        const response = await axios.get('/allAnimals');
        setBackendData(response.data);
        console.log(response.data);
        } catch (error) {
        console.error('Error: ' + error);
        }
    };

        const handleSpecies = (e) => {
            setSpecies(e.target.value);
        };
    
        const handleSubmit = (e) =>{
            e.preventDefault();
            handleChange();
            alert('Data has been submitted');
        };
        
    
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Enter Pet Species:
                        <input
                        type="text"
                        name="species"
                        value={species}
                        onChange={handleSpecies}
                        />
                    </label>
                    <button type="submit">Search</button>
                    <h2>Results:</h2>
                    <ul>
                        {typeof backendData === 'undefined' ? (
                        <p>Loading...</p>
                        ) : (
                        backendData.map((pet) => (
                            <>
                            <li>Species: {pet.species}</li>
                            <li>Age: {pet.age}</li>
                            <li>Gender: {pet.gender}</li>
                            <li>Status: {pet.status}</li>
                            </>
                        ))
                        )}
                    </ul>
                </form>         
            </div>
        );

}
    