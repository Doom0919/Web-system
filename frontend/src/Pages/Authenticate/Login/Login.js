import {useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';
export default function Login(){
    const navigate = useNavigate();
    const[user,setUser] = useState({
        email : '',
        password : ''
    }

    );
     const handleSubmit = (e) => {
        e.preventDefault(); 
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const checker = users.find(
            (user1) =>
              user1.email === user.email && user1.password === user.password
          );
        if(checker){
            localStorage.setItem('token', JSON.stringify({
                u_id: checker.id,
                isLoggedIn: true
              }));
              
           navigate(`/${checker.id}/places`);
           window.location.reload();
        }else{
            alert("Password or email is incorrect")
            setUser({
                email : '',
                password : ''
            }
            );
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser ((prevState) => ({
            ...prevState, 
            [name]: value 
        }));
    };

    return(
     <div className="Login">
        <form className="form" onSubmit={handleSubmit}>
                <h2>Login</h2>
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