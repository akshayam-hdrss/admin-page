import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  uploadImage,
} from '../../../api/api';
import './DoctorDetails.css';

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const res = await getDoctorById(doctorId);
      if (res.data.result === 'Success') {
        const d = res.data.resultData;
        d.gallery = Array.isArray(d.gallery?.[0]) ? d.gallery[0] : d.gallery || [];
        setDoctor(d);
        setFormData({
          ...d,
          order_no: d.order_no ?? "", 
          bannerUrl: d.bannerUrl || '',
          gallery: d.gallery,
        });
        setImagePreview(d.imageUrl);
      }
    } catch (err) {
      console.error('Failed to load doctor details:', err);
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<span key={`f${i}`} className="star full">★</span>);
    if (half) stars.push(<span key="h" className="star half">★</span>);
    for (let i = stars.length; i < 5; i++) stars.push(<span key={`e${i}`} className="star empty">★</span>);
    return stars;
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);

    try {
      if (type === 'profile' || type === 'banner') setLoadingImage(true);
      else setLoadingGallery(true);

      const res = await uploadImage(form);
      const imageUrl = res.data.imageUrl;

      if (type === 'profile') {
        setFormData((prev) => ({ ...prev, imageUrl }));
        setImagePreview(imageUrl);
      } else if (type === 'gallery') {
        setFormData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), imageUrl],
        }));
      } else if (type === 'banner') {
        setFormData((prev) => ({ ...prev, bannerUrl: imageUrl }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setLoadingImage(false);
      setLoadingGallery(false);
    }
  };

  const handleGalleryDelete = (url) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img !== url),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updatedData = {
        ...formData,
        gallery: [JSON.stringify(formData.gallery || [])],
        bannerUrl: formData.bannerUrl || '',
      };
      await updateDoctor(doctorId, updatedData);
      setShowForm(false);
      fetchDoctor();
    } catch (err) {
      console.error('Failed to update doctor:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(doctorId);
        navigate('/hospital');
      } catch (err) {
        console.error('Failed to delete doctor:', err);
      }
    }
  };

  if (!doctor) return(
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>
          {/* Loading Categories... */}
        </p>
      </div>
    );;

  return (
    <div className="doctor-details-page-custom">

      {/* Banner Section */}
      {doctor.bannerUrl && (
        <div className="banner-container-custom">
          <img src={doctor.bannerUrl} alt="Banner" className="doctor-banner-custom" />
        </div>
      )}

      <div className="header-row-custom">
        <h1>Doctor Details</h1>
        <div className="actions-custom">
          <button className="btn-custom btn-edit-custom" onClick={() => setShowForm(true)}>Edit</button>
          <button className="btn-custom btn-delete-custom" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="details-card-custom">
        <img src={doctor.imageUrl || 'https://via.placeholder.com/150'} alt={doctor.doctorName} className="doctor-image-custom" />
        <div className="info-custom">
          <h2>{doctor.doctorName}</h2>
          <p><strong>Specialty:</strong> {doctor.degree}</p>
          <p><strong>Business Name:</strong> {doctor.businessName}</p>
          <div className="rating-custom">
            {renderStars(doctor.rating)}
            <span className="rating-num-custom">{parseFloat(doctor.rating).toFixed(1)}</span>
          </div>
          <p><strong>Order_no:</strong> {doctor.order_no ?? 'null'}</p>
          <p><strong>Experience:</strong> {doctor.experience}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
          <p><strong>WhatsApp:</strong> {doctor.whatsapp}</p>
          <p><strong>Location:</strong> {doctor.location}</p>
          <p><strong>Address 1:</strong> {doctor.addressLine1}</p>
          <p><strong>Address 2:</strong> {doctor.addressLine2}</p>
          <p><strong>Map:</strong> <a href={doctor.mapLink} target="_blank" rel="noreferrer">View Map</a></p>
          <p><strong>YouTube:</strong> <a href={doctor.youtubeLink} target="_blank" rel="noreferrer">Watch</a></p>
          <p><strong>About:</strong> {doctor.about}</p>
        </div>

        {doctor.gallery?.length > 0 && (
          <div id="galleryCarousel" className="carousel slide mt-4" data-bs-ride="carousel">
            <div className="carousel-inner">
              {doctor.gallery.map((imgUrl, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                  <img
                    src={imgUrl}
                    className="d-block w-100"
                    alt={`Gallery ${index + 1}`}
                    style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </div>
              ))}
            </div>
            {doctor.gallery.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#galleryCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#galleryCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="form-overlay-custom">
          <form className="form-container-custom" onSubmit={handleSubmit}>
            <h2>Edit Doctor</h2>
            {[
              { label: 'Name *', name: 'doctorName' },
              { label: 'Degree', name: 'degree' },
              {label : 'order_no', name:'order_no'},
              { label: 'Business Name', name: 'businessName' },
              { label: 'Experience', name: 'experience' },
              { label: 'Phone', name: 'phone' },
              { label: 'WhatsApp', name: 'whatsapp' },
              { label: 'Location', name: 'location' },
              { label: 'Address Line 1', name: 'addressLine1' },
              { label: 'Address Line 2', name: 'addressLine2' },
              { label: 'Map Link', name: 'mapLink' },
              { label: 'YouTube Link', name: 'youtubeLink' },
              { label: 'About', name: 'about', type: 'textarea' }
            ].map(({ label, name, type }) => (
              <div className="form-group-custom" key={name}>
                <label>{label}</label>
                {type === 'textarea' ? (
                  <textarea name={name} value={formData[name] || ''} onChange={handleChange} />
                ) : (
                  <input name={name} value={formData[name] || ''} onChange={handleChange} />
                )}
              </div>
            ))}

            <div className="form-group-custom">
              <label>Profile Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
              {loadingImage ? <p>Uploading...</p> :
                imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>

            <div className="form-group-custom">
              <label>Banner Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
              {loadingImage ? <p>Uploading...</p> :
                formData.bannerUrl && <img src={formData.bannerUrl} alt="Banner Preview" className="image-preview" />}
            </div>

            
            <div className="form-group-custom">
              <label>Gallery</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gallery')} />
              {loadingGallery && <p>Uploading...</p>}
              <div className="gallery-preview">
                {formData.gallery?.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                    <img src={img} alt="gallery" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleGalleryDelete(img)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'red',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions-custom">
              <button type="button" className="btn-custom btn-cancel-custom" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-custom btn-save-custom" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <button className="back-link-custom" onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}
