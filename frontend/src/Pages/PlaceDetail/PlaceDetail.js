import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './PlaceDetail.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from '../../api';

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function PlaceDetail() {
  const { u_id, p_id } = useParams();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken); 
    }
    api.get(`http://localhost:5000/api/places/${p_id}`)
      .then(response => {
        setPlace(response.data.place);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching place:', error);
        setIsLoading(false);
      });
  }, [authToken, p_id]);
   
  if (isLoading) {
    return (
      <div className="loading-container" aria-busy="true">
        <div className="loading-spinner" role="status"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!place) {
    return <p className="error-message" role="alert">Place not found</p>;
  }

  return (
    <div className="place-detail-container">
      <div className="place-header">
        <h1 className="place-title">{place.title}</h1>
        <p className="place-location">
          <span className="location-icon">Location:</span> {place.location}
        </p>
      </div>

      <div className="place-image-container">
        <img
          src={place.imgLink}
          alt={place.title || 'Place image'}
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
            <span className="coord-label">Longitude:</span> {place.loc_x}
          </p>
          <p className="coordinate">
            <span className="coord-label">Latitude:</span> {place.loc_y}
          </p>

        
        </div>
      </div>

      <div className="map-container" style={{ marginTop: "20px" }}>
        <MapContainer
          center={[place.loc_x, place.loc_y]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[place.loc_x, place.loc_y]} />
        </MapContainer>
      </div>
      {authToken && authToken.toString() === u_id.toString() && (
            <Link to={`/editplace/${u_id}/${p_id}`}>
              <button className="button">Edit Place</button>
            </Link>
          )}
    </div>
  );
}
