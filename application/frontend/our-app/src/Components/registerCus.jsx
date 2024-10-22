import axios from "axios";
import React, { useState } from "react";
import './styles/registerCus.css'

export const RegisterCus = () => {

    const navigateToLogin = () => {
        window.location.href = '/login'; 
    };
    
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [occupation, setOccupation] = useState('');
    const [desire, setDesire] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');

    const [criminalHistory, setCriminalHistory] = useState('');
    const [animalAbuse, setAnimalAbuse] = useState('');
    const [safeEnviornment, setSafeEnviornment] = useState('');
    const [financialSupport, setFinancialSupport] = useState('');
    const [carePlan, setCarePlan] = useState('');
    const [haveHome, setHaveHome] = useState('');
    const [joinMeeting, setJoinMeeting] = useState('');

    const [alertsShown, setAlertsShown] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertsShown(false);
      
        if (password !== confirmPassword) {
            window.alert('Passwords do not match');
            setAlertsShown(true);
            return;
        }
      
        if (password.length < 8) {
            window.alert('Password should be at least 8 characters');
            setAlertsShown(true);
            return;
        }

        const invalidAnswers = [criminalHistory, animalAbuse, safeEnviornment, financialSupport, carePlan, haveHome, joinMeeting].some(answer => answer === 'No');
        
        if (invalidAnswers) {
            window.alert('Invalid registration. Please review your questionnaire answers.');
            setAlertsShown(true);
            return;
        }

        if (!firstname || !lastname || !username || !email || !password || !confirmPassword || 
            !occupation || !desire || !age || !phone) {
            window.alert('All fields are required');
            setAlertsShown(true);
            return;
        }

        // if (phone.length !== 10) {
        //     console.log('Phone number should be 10 digits');
        //     return;
        // }

        if (!alertsShown) {
            const user = {
                firstname,
                lastname,
                username, 
                email,
                password,
                occupation,
                desire,
                age,
                phone
            };

            try {
                const response = await axios.post("/users/create_normal", user);
                console.log("User registered: ", response.data);
                navigateToLogin();
            } catch (error){
                console.log("Error: ", error)
            }
        }
    }
    return(
        <div className="container">
           <h1 className="header">Customer Registration</h1>
            <form onSubmit={handleSubmit} className="form">
                <div class="user-info">
                    <div>
                        <label className="fname" class="smaller-info" htmlFor="firstname">First Name </label>
                        <input type="text" id="firstname" name="firstname" class="smaller-info" value={firstname} onChange={(e) => setfirstname(e.target.value)}/>
                    </div>
                    <div>
                        <label className="lname" class="smaller-info" htmlFor="lastname">Last Name </label> 
                        <input type="text" id="lastname" name="lastname" class="smaller-info" value={lastname} onChange={(e) => setlastname(e.target.value)}/>
                    </div>
                </div>
                <br/>

                <label className= "username" htmlFor="username">Username </label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setusername(e.target.value)}/>
                <br/>

                <label className="ename" htmlFor="email">Email </label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <br/>

                <label className="password" htmlFor="password">Password </label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPass(e.target.value)}/>
                <br/>

                <label className="comfirmPassword" htmlFor="comfirmPassword">Confirm Password </label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <br/>

                <label className="occupation" htmlFor="occupation">Occupation </label> 
                <input type="text" id="occupation" name="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)}/>
                <br/>

                <label className="desire" htmlFor="desire">Desire </label> 
                <input type="text"  id="desire"  name="desire" value={desire} onChange={(e) => setDesire(e.target.value)}/>
                <br/>

                <div class="user-info">
                    <div>
                        <label className="phone" class="smaller-info">Phone Number </label>
                        <input value={phone} class="smaller-info" onChange={(e) => setPhone(e.target.value)}/>
                    </div>
                    <div>
                        <label className="age" class="smaller-info">Age</label>
                        <input type="number" class="smaller-info" id="age"name="age" value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                </div>
                <br />

                <label class="questionnaire-label">You do not have any criminal history that might affect your ability to adopt a pet? </label>
                <select value={criminalHistory} className="questionnaire"  onChange={(e) => setCriminalHistory(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label class="questionnaire-label">You have never been convicted of animal abuse or cruelty? </label>
                <select value={animalAbuse} className="questionnaire"  onChange={(e) => setAnimalAbuse(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label class="questionnaire-label">Are you currently able to provide a safe and loving environment for a pet </label>
                <select value={safeEnviornment} className="questionnaire"  onChange={(e) => setSafeEnviornment(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label class="questionnaire-label">Can you financially support the ongoing needs of a pet? </label>
                <select value={financialSupport} className="questionnaire"  onChange={(e) => setFinancialSupport(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label class="questionnaire-label">Do you have a plan for what will happen to the pet if you are no longer able to care for it? </label>
                <select value={carePlan} className="questionnaire"  onChange={(e) => setCarePlan(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label class="questionnaire-label">Do you own a home, or if you rent, do you have permission from your landlord to have pets?</label>
                <select value={haveHome} className="questionnaire"  onChange={(e) => setHaveHome(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label class="questionnaire-label">Do you consent to participating in a meeting as part of the adoption process if your application is approved to become a pet owner? </label>
                <select value={joinMeeting} className="questionnaire"  onChange={(e) => setJoinMeeting(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>



                <div class="user-info">
                    <button class='register-button' onClick={handleSubmit && navigateToLogin}>Register</button>
                    <button class='register-button' onClick={navigateToLogin} >Have an account? Sign in here.</button>
                </div>
            </form>
        </div>
    );
}
