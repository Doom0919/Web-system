import { useEffect, useState } from 'react';
import UserCard from '../../Component/User/UserCard/UserCard.js';
import api from '../../api';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('http://localhost:5000/api/users')
            .then(response => {
                setUsers(response.data.users); 
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('An error occurred while fetching user data. Please try again later.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="Home">
            {users.length > 0 ? (
                users.map(user => (
                    <UserCard
                        key={user._id} // Use a unique key
                        imgLink={user.imgLink || 'https://via.placeholder.com/150'}
                        name={user.name}
                        u_id={user._id}
                    />
                ))
            ) : (
                <p>No users found. Please register a user!</p>
            )}
        </div>
    );
}
