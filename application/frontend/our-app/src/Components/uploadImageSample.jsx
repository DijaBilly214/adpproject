import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const NewImage = () => {
    const [file, setFile] = useState();
    const [data, setData] = useState([]);

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }
    //to display image
    useEffect(()=>{
        axios.get('/allImages/animal_image/3')
        .then(res=>{
                console.log("getting image")
                setData(res.data[0][0])
        })
        .catch(err=>console.log(err));
    },[])

    //to upload image
    const handleUpload = ()=>{
        const formadata = new FormData();
        formadata.append('image', file)
        axios.post('/allImages/temp_upload', formadata)
        .then(res=>{
            if(res.status === 200) {
                console.log("upload image Success")
            }else{
                console.log("upload image Failed")
            }
        })
        .catch(err=>console.log(err));
    }
    
    return(
        <div>
            {/**?to upload image */}
            <label for="file">Upload picture: </label>
            <input type ="file" onChange = {handleFile}/>
            <button onClick={handleUpload}> upload</button>
            <br/>
            picture:
            {/**?to display image */}
            <img  src={`http://localhost:3003/images/`+data.imageLink} alt="" />
        </div>
    )
}

export default NewImage;