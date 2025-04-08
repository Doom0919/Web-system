import React, { useState } from 'react';
import './Register.css'; 

export default function Register() {
    const [user, setUser ] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        imgLink: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser ((prevState) => ({
            ...prevState, 
            [name]: value 
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault(); 
        const users = JSON.parse(localStorage.getItem('users'))|| []; 
        const userID = users.length > 0 
            ? Math.max(...users.map((user) => user.id)) + 1 
            : 1;

        const newUser  = { ...user, id: userID };

        users.push(newUser );
        localStorage.setItem('users', JSON.stringify(users));

        console.log('User  saved:', newUser );
        alert('User  registered successfully!');

    
        setUser ({
            id: null,
            name: '',
            email: '',
            password: '',
            imgLink: ''
        });  
    };
    
    return (
        <div className="Register">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="User  name"
                    value={user.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="imgLink"
                    placeholder="Image link"
                    value={user.imgLink}
                    onChange={handleInputChange}
                />
                <div className='image'>
                    {user.imgLink && <img src={user.imgLink} alt="Profile" />}
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}