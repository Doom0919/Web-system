import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './AddPlace.css';
import { useNavigate } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function AddPlace({authToken, api }) {
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    title: '',
    description: '',
    imgLink: '',
    location: '',
    loc_x: 47.918873,
    loc_y: 106.917702,
  });
  const [errors, setErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!place.title.trim()) {
      setErrors([{ msg: "Title is required." }]);
      return;
    }
    if (!place.location.trim()) {
      setErrors([{ msg: "Location is required." }]);
      return;
    }
    if (isNaN(place.loc_x) || isNaN(place.loc_y)) {
      setErrors([{ msg: "Coordinates must be valid numbers." }]);
      return;
    }

    try {
      if (!authToken) {
        alert([{ msg: "Authentication token is missing. Please log in." }]);
        return;
      }
      await api.post(
        '/places/',
        {
          title: place.title,
          description: place.description,
          imgLink: place.imgLink,
          location: place.location,
          loc_x: place.loc_x,
          loc_y: place.loc_y,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Fix header capitalization
          },
        }
      );
      alert("Place added successfully!");
      navigate('/');
      setPlace({
        title: '',
        description: '',
        imgLink: '',
        location: '',
        loc_x: 47.918873,
        loc_y: 106.917702
      });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ msg: 'Error adding place: ' + (error.message || 'Unknown error') }]);
        console.error('Error adding place:', error);
      }
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPlace((prevState) => ({
          ...prevState,
          loc_x: lat,
          loc_y: lng
        }));
      },
    });

    return (
      <Marker position={[place.loc_x, place.loc_y]} />
    );
  };

  return (
    <div className="AddPlace">
      <h2 className="form-title">Add a New Place</h2>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          {errors.map((err, index) => (
            <p key={index} className="error-message">{err.msg}</p>
          ))}
          <input
            type="text"
            name="title"
            placeholder="Place Name"
            value={place.title}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={place.description}
            onChange={handleInputChange}
            className="form-textarea"
          />
          <input
            type="text"
            name="imgLink"
            placeholder="Image Link"
            value={place.imgLink}
            onChange={handleInputChange}
            className="form-input"
          />
          <div className="image-preview">
            {place.imgLink && <img src={place.imgLink} alt="Preview" />}
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location Name"
            value={place.location}
            onChange={handleInputChange}
            className="form-input"
          />
          <div className="map-container">
            <MapContainer
              center={[place.loc_x, place.loc_y]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>
          <input type="submit" value="Submit" className="form-submit" />
        </form>
      </div>
    </div>
  );
}
