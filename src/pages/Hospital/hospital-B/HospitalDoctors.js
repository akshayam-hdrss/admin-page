import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './HospitalDoctors.css';
// import profile from '../../../assets/Doctors_img.webp';

export default function HospitalDoctors() {
  const { hospitalId, categoryName } = useParams();
  const [loading, setLoading] = useState(true); // ✅ Loading state

  // Simulated doctor data
  const initialDoctors = [
    { id: 1, name: 'Dr. John Doe', experience: '10 years', hospital: 'City General Hospital', rating: 4.2, imageUrl: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Dr. Anna Jones', experience: '5 years', hospital: 'Sunrise Health Clinic', rating: 3.8, imageUrl: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Dr. Robert Brown', experience: '8 years', hospital: 'Lakeside Medical Center', rating: 4.6, imageUrl: 'https://via.placeholder.com/50' },
  ];

  const [doctors, setDoctors] = useState(initialDoctors);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    hospital: '',
    order_no:'',
    rating: '',
    imageUrl: ''
  });

  // ✅ Show spinner for 1.2s on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<span key={`full${i}`} className="star full">★</span>);
    if (half) stars.push(<span key="half" className="star half">★</span>);
    const empty = 5 - stars.length;
    for (let i = 0; i < empty; i++) stars.push(<span key={`empty${i}`} className="star empty">★</span>);
    return stars;
  };

  const handleAdd = () => {
    setFormData({ name: '', experience: '', hospital: '', rating: '', imageUrl: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (doc) => {
    setFormData({
      name: doc.name,
      experience: doc.experience,
      hospital: doc.hospital,
      rating: doc.rating.toString(),
      imageUrl: doc.imageUrl
    });
    setEditingId(doc.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const handleDeleteAll = () => {
    setDoctors([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, experience, hospital, rating, imageUrl } = formData;
    if (!name || !experience || !hospital) return;

    const numericRating = parseFloat(rating) || 0;
    if (editingId) {
      setDoctors(prev => prev.map(d =>
        d.id === editingId ? { ...d, name, experience, hospital, rating: numericRating, imageUrl } : d
      ));
    } else {
      const newDoc = {
        id: Date.now(),
        name,
        experience,
        hospital,
        rating: numericRating,
        imageUrl
      };
      setDoctors(prev => [...prev, newDoc]);
    }
    setShowForm(false);
  };

  // ✅ Show loading spinner
   if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>
          {/* Loading Categories... */}
        </p>
      </div>
    );
  }

  return (
    <div className="hospital-doctors-page">
      <div className="header-row">
        <h1>Doctors Name</h1>
        <div className="actions">
          <button className="btn btn-add" onClick={handleAdd}>+ Add Doctor</button>
          <button className="btn btn-delete-all" onClick={handleDeleteAll}>Delete All</button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <form className="form-container" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Doctor' : 'Add Doctor'}</h2>
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
            {/* <label >Order_no</label> */}

            <label>Experience *</label>
            <input name="experience" value={formData.experience} onChange={handleChange} required />
            <label>Hospital *</label>
            <input name="hospital" value={formData.hospital} onChange={handleChange} required />
            <label>Rating</label>
            <input name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} />
            <label>Image URL</label>
            <input name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="doctors-list">
        {doctors.map(doc => (
          <div key={doc.id} className="doctor-row">
            <div className="col image">
              <img src={doc.imageUrl} alt={doc.imageUrl} className="doctor-image" />
            </div>
            <div className="col name"><strong>{doc.name}</strong></div>
            <div className="col experience">{doc.experience}</div>
            <div className="col experience">{doc.order_no}</div>
            <div className="col hospital">{doc.hospital}</div>
            <div className="col rating">
              <div className="stars">{renderStars(doc.rating)} <span className="rating-num">{doc.rating.toFixed(1)}</span></div>
            </div>
            <div className="col actions-col">
              <Link to={`/hospitals/${hospitalId}/categories/${categoryName}/doctors/${doc.id}`} className="btn btn-details">Details</Link>
              <button className="btn btn-edit" onClick={() => handleEdit(doc)}>✏</button>
              <button className="btn btn-delete" onClick={() => handleDelete(doc.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <Link to={`/HosptialArea`} className='back-link'>← Back to Categories</Link>
    </div>
  );
}
