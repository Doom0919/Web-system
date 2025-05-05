import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Header.css';

export default function Header({ authToken, setAuthToken }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setAuthToken(storedToken); 
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        navigate('/authenticate/login/');
    };
    const here = ()=> {
        alert("Header component loaded "+authToken); 
    }
    return (
        <header className="Header">

            <Link to='/'><h2>Travel App  </h2></Link>
            {authToken !== null ? (
                <div className="buttons">
                    <Link to='/addplace/'><button>Add Place</button></Link>
                    <Link to={`/${authToken}/places/`}><button>Places</button></Link>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="buttons">
                    <Link to='/authenticate/login/'><button>Login</button></Link>
                    <Link to='/authenticate/register/'><button>Sign up</button></Link>
                </div>
            )}
        </header>
    );
}
