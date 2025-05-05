import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';
import axios from 'axios';

export default function Login({ setAuthToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!user.email || !user.password) {
      alert('Please fill in both email and password fields.');
      return;
    }

    console.log("Login request:", user); // Log the login request

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email: user.email,
        password: user.password
      });
      const { userId } = res.data;
      setAuthToken(userId); 
      localStorage.setItem('authToken', userId); 
      navigate(`/${userId}/places`);
      window.location.reload();  
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Invalid email or password");
      }
      setUser({
        email: '',
        password: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState, 
      [name]: value
    }));
  };

  return (
    <div className="Login">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errors.map((err, index) => (
          <p key={index} className="error-message">{err.msg}</p>
        ))}
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
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
