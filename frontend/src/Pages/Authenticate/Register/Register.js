import React, { useState, useEffect } from 'react';
import './Register.css';
import axios from 'axios';

export default function Register() {
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        imgLink: ''
    });

    const [users, setUsers] = useState([]); 
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
          .then(response => {
            setUsers(response.data);
          })
          .catch(error => console.error('Error fetching users:', error));
      }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const userID = users.length > 0
            ? Math.max(...users.map((user) => parseInt(user.id))) + 1 
            : 1;

        const newUser = { ...user, id: userID };
        console.log(newUser);

        try {
            const response = await axios.post('http://localhost:5000/api/users/signup', newUser);
            console.log('User created:', response.data);
            setUser({
                id: '',
                name: '',
                email: '',
                password: '',
                imgLink: ''
            });
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error creating user:', error);
            }
        }
    };

    return (
        <div className="Register">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {errors.map((err, index) => (
                    <p key={index} className="error-message">{err.msg}</p>
                ))}
                <input
                    type="text"
                    name="name"
                    placeholder="User name"
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
                <div className="image">
                    {user.imgLink && <img src={user.imgLink} alt="Profile" />}
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
