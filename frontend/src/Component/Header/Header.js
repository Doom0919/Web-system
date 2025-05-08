import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import './Header.css';

export default function Header({ authToken, setAuthToken }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    // Redirect to login if authToken is missing
    useEffect(() => {
        if (!authToken) {
            navigate('/authenticate/login/');
        }
    }, [authToken, navigate]);

    // Handle logout
    const handleLogout = () => {
        setAuthToken(null);
        navigate('/authenticate/login/');
    };

    // Fetch user ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/loginu', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                setUserId(response.data.userId);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        if (authToken) {
            fetchUserId();
        }
    }, [authToken]);

    return (
        <header className="Header">
            <Link to='/'><h2>Travel App</h2></Link>
            {authToken !== null ? (
                <div className="buttons">
                    <Link to='/addplace/'><button>Add Place</button></Link>
                    <Link to={`${userId}/places/`}><button>Places</button></Link>
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
