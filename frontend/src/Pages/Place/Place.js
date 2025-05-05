import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api";
import PlaceCard from "../../Component/PlaceCard/PlaceCard";

export default function Place() {
  const { u_id } = useParams();
  const [fplaces, setFplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Retrieved u_id:", u_id);
    if (!u_id) {
      console.error("User ID is undefined. Please check the URL or login again.");
      setError("User ID is missing. Please check the URL or login again.");
      setLoading(false);
      return;
    }

    api.get(`http://localhost:5000/api/places/user/${u_id}`)
      .then((res) => {
        setFplaces(res.data.places);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching places:", err);
        setError("Failed to fetch places. Please try again later.");
        setLoading(false);
      });
  }, [u_id]);

  if (loading) return <p>Уншиж байна...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="place">
      {fplaces.length > 0 ? (
        fplaces.map((place) => (
          <PlaceCard
            key={place._id}
            u_id={place.creator} // MongoDB-д creator гэж ирнэ
            p_id={place._id}
            title={place.title}
            imgLink={place.imgLink || "https://via.placeholder.com/150"}
          />
        ))
      ) : (
        <p>Газрын мэдээлэл олдсонгүй.</p>
      )}
    </div>
  );
}
