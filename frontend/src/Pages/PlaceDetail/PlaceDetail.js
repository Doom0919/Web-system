import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './PlaceDetail.css'; 
import { Link } from 'react-router-dom';
export default function PlaceDetail() {
  const { u_id, p_id } = useParams();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token,setToken] = useState({
    u_id : '',
    isLoggedIn : false 
  });

  useEffect(() => {
    const places = JSON.parse(localStorage.getItem('places')) || [];

    const selectedPlace = places.find(
      (place) => place.u_id.toString() === u_id.toString() && place.p_id.toString() === p_id.toString()
    );
    const timer = setTimeout(() => {
      setPlace(selectedPlace);
      setIsLoading(false);
    }, 500);
    const tok = JSON.parse(localStorage.getItem("token"));
    setToken(tok || { u_id: '', isLoggedIn: false });

    return () => clearTimeout(timer);
  }, [u_id,p_id]);

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );

  if (!place) return <p className="error-message">Place not found</p>;

  return (
    <div className="place-detail-container">
      <div className="place-header">
        <h1 className="place-title">{place.title}</h1>
        <p className="place-location">
          <span className="location-icon"> Location : </span> {place.location}
        </p>
      </div>
      
      <div className="place-image-container">
        <img 
          src={place.imgLink} 
          alt={place.title} 
          className="place-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image+Available';
          }}
        />
      </div>
      
      <div className="place-info">
        <h2 className="section-title">Description</h2>
        <p className="place-description">{place.description}</p>
        
        <div className="coordinates">
          <p className="coordinate">
            <span className="coord-label">Уртраг:</span> {place.loc_x}
          </p>
          <p className="coordinate">
            <span className="coord-label">Өргөрөг:</span> {place.loc_y}
          </p>
          {token.isLoggedIn &&  u_id.toString() === token.u_id.toString() ?(<Link to ={`/editplace/${u_id}/${p_id}`} ><button className='button'>Edit Place</button></Link>)  :(<></>) }
        </div>
      </div>
    </div>
  );
}