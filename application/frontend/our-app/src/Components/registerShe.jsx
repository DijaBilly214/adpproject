import axios from "axios";
import React, { useState } from "react";
import './styles/registerCus.css'


export const RegisterShe = () => {

    const navigateToLogin = () => {
        window.location.href = '/login'; 
      };

    const [values, setValues] = useState({
        username: '',
        password: '',
        email: '',
        address: '',
        website: '',
        phone: ''
    })

    // const [username, setusername] = useState('');
    // const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [email, setEmail] = useState('');
    // const [address, setAddress] = useState('');
    // const [website, setWebsite] = useState('');
    // const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values) {
            console.log('All fields are required');
            return;
        }

        if (values.password.length < 8) {
            console.log('Password should be at least 8 characters');
            return;
        }

        if (values.phone.length !== 10) {
            console.log('Phone number should be 10 digits');
            return;
        }

        try {
            const response = await axios.post("/users/create_shelter", values);
            console.log("Shelter registered: ", response.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    return (
        <div className="container">
            <h1 className="header">Shelter Registration</h1>
            <form onSubmit={handleSubmit} class='form'>
                <label for="username">Shelter Name</label>
                <input 
                type="text" 
                name="username" 
                onChange={(e) => setValues({...values, username: e.target.value})}
                required
                />
                <br />

                <label for="password">Password</label>
                <input 
                type="password" 
                name="password" 
                onChange={(e) => setValues({...values, password: e.target.value})}
                required
                />
                <br />

                <label for="confirmPassword">Confirm Password</label>
                <input 
                type="password" 
                name="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
                <br/>

                <label for="email">Email</label>
                <input 
                type="email" 
                name="email" 
                onChange={(e) => setValues({...values, email: e.target.value})}
                required
                />
                <br />

                <label for="address">Address</label>
                <input 
                    type="text" 
                    name="address" 
                    onChange={(e) => setValues({...values, address: e.target.value})}
                    required
                    />
                <br />

                <label for="website">Website</label>
                <input 
                    type="text" 
                    name="website" 
                    onChange={e => setValues({...values, website: e.target.value})}
                    />
                <br />

                <label for="phone">Phone Number</label>
                <input 
                    onChange={e => setValues({...values, phone: e.target.value})}
                    optional
                />
                <br />

                <div class="user-info">
                    <button class='register-button' type="submit" onClick={navigateToLogin}>Register</button>
                    <button class='register-button' onClick={navigateToLogin} >Have an account? Sign in here.</button>
                </div>

            </form>
        </div>
    );
};
