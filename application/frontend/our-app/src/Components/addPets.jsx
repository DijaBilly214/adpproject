import React, { useState, useEffect}  from 'react';
import './styles/blogs.css';
import axios from 'axios';

export const AddPet = () => {

    const [newPet, setNewPet] = useState({
      animename: '',
      species: '',
      breed: '',
      gender: '',
      age: '',
      color: '',
      comment: '',
      // imageLink: '',
    });

    const [errMsg, setErrMsg] = useState('');

    // const handleFileChange = (e) => {
    //   const file = e.target.value;
    //   // console.log(file);
    //   setNewPet((prevPet) => ({ ...prevPet, imageLink: file }));
    // };

    const handleAddPet = async (e) => {
        e.preventDefault();

        try {
          const responseAddPet = await axios.post('/allAnimals/addPet', newPet);
          // const imageFormData = new FormData();
          // imageFormData.append('image', newPet.imageLink);

          // console.log(responseAddPet)
          // const petId = responseAddPet.data.id;

          // const responseImageUpload = await axios.post(`/allImages/animal_upload/${petId}`, imageFormData);
          // console.log(responseAddPet.data);
          // console.log('Image uploaded:', responseImageUpload.data);

          setNewPet({
            animename: '',
            species: '',
            breed: '',
            gender: '',
            age: '',
            color: '',
            comment: '',
            // imageLink: '',
          });

        } catch (error) {
            if (!error?.response) {
                setErrMsg('Server is Not Responding');
                console.error('Error:', errMsg);
            }else {
                setErrMsg('Creating New Pet Failed');
                console.error('Error:', errMsg);
            }
        }
    }

    useEffect (() =>{
        setErrMsg('');
    }, [newPet]);

  
    return (
      <div>
        <h1 className="blog-title">Add New Pet To Your Shelter</h1>
        <form>
          <label>Name of Animal:</label>
          <input 
                type="text" 
                name="animalname"
                value= {newPet.animalname}
                placeholder='Animal Name'
                onChange={(e) => setNewPet({...newPet, animalname: e.target.value})}
                required
                />
            <br/>
  
          <label>Species: </label>
          <input 
            type="text" 
            name="species" 
            placeholder='Animal Species'
            value= {newPet.species}
            onChange={(e) => setNewPet({...newPet, species: e.target.value})}
            required
            />
            <br/>
  
          <label>Breed: </label>
          <input 
            type="text" 
            name="breed" 
            placeholder='Animal Breed'
            value={newPet.breed}
            onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
            required
            />
            <br/>

          <label>Gender: </label>
          <input 
                type="text" 
                name="gender"
                placeholder='Animal Gender'
                value= {newPet.gender}
                onChange={(e) => setNewPet({...newPet, gender: e.target.value})}
                required
                />
            <br/>

          <label>Age: </label>
          <input 
                type="text" 
                name="age"
                placeholder='Animal Age'
                value= {newPet.age}
                onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                required
                />
            <br/>

          <label>Color: </label>
          <input 
                type="text" 
                name="color"
                placeholder='Animal Color'
                value= {newPet.color}
                onChange={(e) => setNewPet({...newPet, color: e.target.value})}
                required
                />
            <br/>

          <label>Comment:</label>
          <textarea 
                type="text"
                name="comment" 
                cols="45" 
                rows="10"
                placeholder='Animal Comment...'
                value={newPet.comment} 
                onChange= {(e) => setNewPet({...newPet, comment: e.target.value})}
                required
                />
            <br/>
{/* 
          <label>Image Upload:</label>
          <input 
                type="file"
                name="file" 
                value={newPet.imageLink} 
                onChange={handleFileChange}
                required
                />
            <br/> */}
  
          <button class="post-button" onClick={handleAddPet}>Add Pet</button>
        </form>

      </div>
    );
  };
  
  export default AddPet;