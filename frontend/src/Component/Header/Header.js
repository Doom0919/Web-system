import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';
export default function Header(){
    const navigate = useNavigate();
    const[token, setToken] = useState(
   {
    u_id : '',
    isLoggedIn : false 
   }
    );
    useEffect(() => {
        const tok = JSON.parse(localStorage.getItem("token"));
        setToken(tok || {u_id : '' , isLoggedIn : false});
    },[]);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken({isLoggedIn : false , u_id : ''});
        navigate('/');
        window.location.reload();
    }
    return(
        <header className="Header">
            <Link to = '/' ><h2> Travel app</h2></Link>
            {token.isLoggedIn ? (
                <div className="buttons">
                    <Link to ='/addplace/' ><button>Add PLace</button></Link>
                    
                    <Link to = {`/${token.u_id}/places/`}><button>Places</button></Link>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ): (
                <div className="buttons">
                    <Link to = '/authenticate/login/'><button>Login</button></Link>
                    <Link to ='/authenticate/register/'><button>Sign up</button></Link>
                </div>
            )}
        </header>
    )
} 