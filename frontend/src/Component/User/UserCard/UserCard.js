import './UserCard.css'
import {Link} from 'react-router-dom';
export default function UserCard({imgLink , name , u_id}){
    return(
      <Link to={`/${u_id}/places/`}>
      <div className="UserCard">
        <img src={imgLink} alt="profole"/>
        <p>{name}</p>
     </div> 
    </Link>
    );
}




