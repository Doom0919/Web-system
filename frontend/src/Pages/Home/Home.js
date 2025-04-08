import { useEffect ,useState } from 'react';
import UserCard from '../../Component/User/UserCard/UserCard.js'


export default function Home() {
    const [users,setUsers] = useState([]);

    useEffect( () =>{
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const token = JSON.parse(localStorage.getItem('token'));
        if(!!token){
         const filterUsers = storedUsers.filter((user) => user.id.toString() !== token.u_id.toString());
         setUsers(filterUsers);
        }else{
        setUsers(storedUsers);
        }
    },[]);
    
    return (
        <div className="Home">
            {users.length > 0 ? (
                users.map((user, index) => (
                    <UserCard key={index} imgLink={user.imgLink} name={user.name} u_id = {user.id}/>
                ))
            ) : (
                <p>No users found. Please register some users!</p>
            )}
        </div>
    );
}