import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './EditPlace.css';
import api from '../../api';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import '../AddPlace/AddPlace.css';
// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function EditPlace() {
  const { u_id, p_id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    title: '',
    description: '',
    location: '',
    loc_x: 47.918873, // default latitude
    loc_y: 106.917702, // default longitude
    imgLink: ''
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    api.get(`http://localhost:5000/api/places/${p_id}`)
      .then(response => {
        setPlace(response.data.place);
      })
      .catch(error => {
        console.error('Error fetching place:', error);
      });
  }, [p_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlace(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await api.patch(`http://localhost:5000/api/places/${p_id}`, place, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      alert("Place updated successfully!");
      navigate(`/placedetail/${u_id}/${p_id}`);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error updating place:', error);
      }
    }
  };
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this place?");
    if (!confirmed) return;
  
    try {
      await api.delete(`http://localhost:5000/api/places/${p_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      alert("Place deleted successfully!");
      navigate(`/profile/${u_id}`); // эсвэл өөр хүссэн хуудас руу
    } catch (err) {
      console.error("Error deleting place:", err);
      alert("Failed to delete place.");
    }
  };
  
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPlace(prev => ({
          ...prev,
          loc_x: lat,
          loc_y: lng
        }));
      }
    });
    return place.loc_x && place.loc_y ? (
      <Marker position={[place.loc_x, place.loc_y]} />
    ) : null;
  };

  return (
    <div className="edit-place-container" style={{ width: "40%" }}>
      <h2>Edit Place</h2>
      <form className="form" onSubmit={handleSubmit}>
        {errors.map((err, index) => (
          <p key={index} className="error-message">{err.msg}</p>
        ))}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={place.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={place.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={place.location}
          onChange={handleInputChange}
        />
        <div className="coords">
          <input
            type="text"
            name="loc_x"
            placeholder="Latitude"
            value={place.loc_x}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="loc_y"
            placeholder="Longitude"
            value={place.loc_y}
            onChange={handleInputChange}
          />
        </div>
        <input
          type="text"
          name="imgLink"
          placeholder="Image Link"
          value={place.imgLink}
          onChange={handleInputChange}
        />
        <div className='image-preview'>
          {place.imgLink && <img src={place.imgLink} alt="Preview" style={{width : '400px'}} onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image+Available';
          }}  />}
        </div>

        <div className="map-container">
        <MapContainer
        center={[place.loc_x, place.loc_y]}
        zoom={13}
          scrollWheelZoom={true}
        style={{ height: "300px", width: "100%" }}
>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleDelete}>
            Delete
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
