import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './EditPlace.css';

export default function EditPlace() {
    const { u_id, p_id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState({
        title: '',
        description: '',
        location: '',
        loc_x: '',
        loc_y: '',
        imgLink: ''
    });

    useEffect(() => {
        const places = JSON.parse(localStorage.getItem('places')) || [];
        const foundPlace = places.find(p => p.u_id.toString() === u_id && p.p_id.toString() === p_id);
        
        if (foundPlace) {
            setPlace(foundPlace);
        }
    }, [u_id, p_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlace(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const places = JSON.parse(localStorage.getItem('places')) || [];
        const updatedPlaces = places.map(p => 
            p.u_id.toString() === u_id && p.p_id.toString() === p_id 
                ? { ...p, ...place } 
                : p
        );

        localStorage.setItem('places', JSON.stringify(updatedPlaces));
        alert("Газар амжилттай шинэчлэгдлээ!");
        navigate(`/place/${u_id}/${p_id}`);
    };

    return (
        <div className="Addplace">
            <h2>ГАЗАР ЗАСАХ</h2>
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Гарчиг"
                    value={place.title}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Тайлбар"
                    value={place.description}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Байршил"
                    value={place.location}
                    onChange={handleInputChange}
                />
                <div className="pl">
                    <input
                        type="text"
                        name="loc_x"
                        placeholder="Уртраг"
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
                    placeholder="Зургийн холбоос"
                    value={place.imgLink}
                    onChange={handleInputChange}
                />
                <div className='image'>
                    {place.imgLink && <img src={place.imgLink} alt="Preview" onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x400?text=No+Image+Available';
                    }} />}
                </div>
                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                        Болих
                    </button>
                    <button type="submit" className="submit-btn">
                        Хадгалах
                    </button>
                </div>
            </form>
        </div>
    );
}