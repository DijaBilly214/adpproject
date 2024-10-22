import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import AuthContext from "./context/authProvider";
import axios from "axios";
import './styles/registerCus.css';  

//const LOGIN_URL = '../backend/routes/normal_users';

export const Login = () => {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigateNewPass = () => {
        window.location.href = '/passwordChange'; 
    };

    useEffect(() =>{
        userRef.current.focus();
    }, [])

    useEffect (() =>{
        setErrMsg('');
    }, [username, password,type]);

    const handleLogin = (response) => {
        console.log('Login response:', response);

        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        setAuth({ username, password, type, roles, accessToken });
        navigate('/');
        window.location.reload();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            type,
            username,
            password
        };

        try {
            if (type === "user"){
                const response = await axios.post('/users/normal_login', user);
                handleLogin(response);
            } else if (type === "shelter"){
                const response = await axios.post("/users/shelter_login", user);
                handleLogin(response);
            }
            
        } catch (error) {
            if (!error?.response) {
                setErrMsg('Server is Not Responding');
            }else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

   return (
    <>
        <section class="container">
            <p ref={errRef} className ={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1 className="header">Login</h1>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor ="username">Username</label>
                <input 
                    data-testid="username"
                    type = "text" 
                    placeholder ="username" 
                    id="username" 
                    name="username" 
                    ref={userRef}
                    onChange ={(e) => setUsername(e.target.value)}
                    value={username} 
                    required
                    />
                    
                <label htmlFor ="password">Password</label>
                <input 
                    type = "password" 
                    placeholder ="password" 
                    id="password" 
                    name="password" 
                    onChange ={(e) => setPassword(e.target.value)}
                    value={password} 
                    required
                    />
                <label>User Type:</label>
                <div class='usertypes'>
                    <label class="usertype">
                        <p class='usertype-labels'>User</p>
                        <input
                            type="radio"
                            name="type"
                            value="user"
                            data-testid="user"
                            checked={type === 'user'}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </label>
                    <br/>
                    <label class="usertype">
                        <p class='usertype-labels'>Shelter</p>
                        <input
                            type="radio"
                            name="type"
                            value="shelter"
                            data-testid="shelter"
                            checked={type === 'shelter'}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </label>
                </div>    
                <div class="user-info">
                    <button data-testid="login" class='register-button' type="submit">Login</button>
                    <button data-testid="login" class = 'register-button' onClick={navigateNewPass}>Forgot Password?</button>
                </div>
            </form>
        </section>
    </>
   ); 
}
