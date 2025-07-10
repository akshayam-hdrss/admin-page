import React from 'react';
import './Topstars.css';
import doctors from '../../assets/Doctors_img.webp'
// Example data for top doctors (you can fetch this data from an API)
const topDoctors = [
  {
    id: 1,
    name: 'Dr. John Doe',
    specialty: 'Cardiology',
    rating: 4.9,
    image: doctors,
    achievements: '10+ years of experience, Over 500 successful surgeries',
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    specialty: 'Neurology',
    rating: 4.8,
    image: doctors,
    achievements: 'Innovative treatments in neurocare, Published 10+ research papers',
  },
  {
    id: 3,
    name: 'Dr. Emily Clark',
    specialty: 'Orthopedics',
    rating: 4.7,
    image: doctors,
    achievements: 'Pioneering orthopedic surgeries, Founder of local health awareness programs',
  },
  // Add more doctors as needed
];

export default function Topstars() {
  return (
    <div className="topstars-container">
      <h1 className="topstars-title">Top Doctors</h1>
      <div className="doctor-list">
        {topDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
            <div className="doctor-info">
              <h2 className="doctor-name">{doctor.name}</h2>
              <p className="doctor-specialty">{doctor.specialty}</p>
              <div className="doctor-rating">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index} className={index < doctor.rating ? 'star filled' : 'star'}>★</span>
                ))}
                <span className="rating-number">({doctor.rating})</span>
              </div>
              <p className="doctor-achievements">{doctor.achievements}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
