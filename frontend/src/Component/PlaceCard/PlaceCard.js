import '../User/UserCard/UserCard.css'
import {Link} from 'react-router-dom';
export default function PlaceCard({u_id , p_id , title , imgLink}){
    
    return(
    <Link to= {`/placedetail/${u_id}/${p_id}`}>
      <div className="UserCard">
        <img src={imgLink} alt="profole"/>
        <p>{title}</p>
     </div> 
    </Link>

    );
}




