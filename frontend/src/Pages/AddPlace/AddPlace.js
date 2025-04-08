import { useState, useEffect } from "react";
import './AddPlace.css';

export default function AddPlace() {
  const [place, setPlace] = useState({
    p_id: '',
    title: '',
    description: '',
    location: '',
    loc_x: '',
    loc_y: '',
    imgLink: ''
  });

  const [token, setToken] = useState({
    u_id: '',
    isLoggedIn: false
  });

  useEffect(() => {
    const tok = JSON.parse(localStorage.getItem("token"));
    setToken(tok || { u_id: '', isLoggedIn: false });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token.isLoggedIn) {
      alert("You must be logged in to add a place.");
      return;
    }

    const places = JSON.parse(localStorage.getItem('places')) || [];
    const placeID = places.length > 0 ? Math.max(...places.map((plac) => Number(plac.p_id))) + 1 : 1;

    const newPlace = {
      ...place,
      u_id: token.u_id,
      p_id: placeID
    };

    places.push(newPlace);
    localStorage.setItem('places', JSON.stringify(places));

    alert("Place added successfully!");

    setPlace({
      p_id: '',
      title: '',
      description: '',
      location: '',
      loc_x: '',
      loc_y: '',
      imgLink: ''
    });
  };

  return (
    <div className="Addplace">
      <h2>ADD PLACE</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={place.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
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
        <div className="pl">
          <input
            type="text"
            name="loc_x"
            placeholder="Уртаг"
            value={place.loc_x}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="loc_y"
            placeholder="Өргөрөг"
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
        <div className='image'>
          {place.imgLink && <img src={place.imgLink} alt="Preview" />}
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
