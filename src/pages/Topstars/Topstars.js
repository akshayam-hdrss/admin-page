import React, { useEffect, useState } from 'react';
import './Topstars.css';
import { topdoctors } from '../../api/api';

export default function Topstars() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await topdoctors();
        if (response.data.result === 'Success') {
          setDoctors(response.data.resultData);
        } else {
          setError('Failed to fetch doctors');
        }
      } catch (err) {
        setError('Network error while fetching top doctors.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const renderStars = (rating) => {
    const roundedRating = Math.round(Number(rating));
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < roundedRating ? 'star filled' : 'star'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="topstars-container">
      <h1 className="topstars-title">Top Doctors</h1>

      {loading && <p>Loading top doctors...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="doctor-list">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <img
              src={doctor.imageUrl}
              alt={doctor.doctorName}
              className="doctor-images"
            />
            <div className="doctor-info">
              <h2 className="doctor-name">{doctor.doctorName}</h2>
              <p className="doctor-degree">{doctor.degree}</p>
              <p className="doctor-specialty">{doctor.businessName}</p>
              <p className="doctor-location">{doctor.location}</p>
              <div className="doctor-rating">
                {renderStars(doctor.rating)}
                <span className="rating-number">({doctor.rating})</span>
              </div>
              <p className="doctor-phone">📞 {doctor.phone}</p>
              {doctor.whatsapp && (
                <p className="doctor-whatsapp">💬 WhatsApp: {doctor.whatsapp}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}