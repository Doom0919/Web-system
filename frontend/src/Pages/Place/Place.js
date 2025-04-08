import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PlaceCard from "../../Component/PlaceCard/PlaceCard";

export default function Place() {
  const { u_id } = useParams(); 
  const [fplaces, setFplaces] = useState([]); 

  useEffect(() => {
    try {
      const places = JSON.parse(localStorage.getItem("places")) || [];    
      const filteredPlaces = places.filter(place => place.u_id.toString() === u_id);
      setFplaces(filteredPlaces); 
    } catch (error) {
      console.error("Error parsing places from localStorage:", error);
    }
  }, [u_id]); 

  return (
    <div className="place">
      {fplaces.length > 0 ? (
        fplaces.map((place, index) => (
          <PlaceCard
            key={place.p_id || index} 
            u_id={place.u_id}
            p_id={place.p_id}
            title={place.title}
            imgLink={place.imgLink}
          />
        ))
      ) : (
        <p>No place found!</p>
      )}
    </div>
  );
}
