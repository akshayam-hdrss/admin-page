import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./DoctorName.css";
import profile from "../../../assets/Doctors_img.webp";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  uploadImage,
} from "../../../api/api";

export default function DoctorName() {
  const { hospitalTypeId, hospitalId, doctorTypeId } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    doctorName: "",
    experience: "",
    hospital: "",
    rating: 0,
    imageUrl: "",
    location: "",
    phone: "",
    whatsapp: "",
    doctorTypeId: doctorTypeId ? parseInt(doctorTypeId) : null,
    hospitalId: hospitalId ? parseInt(hospitalId) : null,
    addressLine1: "",
    addressLine2: "",
    mapLink: "",
    about: "",
    gallery: [],
    youtubeLink: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, [hospitalId]);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors({ hospitalId, doctorTypeId });
      setDoctors(res.data.resultData || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setDoctors([]);
    }
  };

  const handleAdd = () => {
    setFormData({
      doctorName: "",
      experience: "",
      hospital: "",
      rating: 0,
      imageUrl: "",
      location: "",
      phone: "",
      whatsapp: "",
      doctorTypeId: doctorTypeId ? parseInt(doctorTypeId) : null,
      hospitalId: hospitalId ? parseInt(hospitalId) : null,
      addressLine1: "",
      addressLine2: "",
      mapLink: "",
      about: "",
      gallery: [],
      youtubeLink: "",
    });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (doc) => {
    setFormData({
      doctorName: doc.doctorName,
      experience: doc.experience || "",
      hospital: doc.businessName,
      rating: 0,
      imageUrl: doc.imageUrl,
      location: doc.location,
      phone: doc.phone,
      whatsapp: doc.whatsapp,
      doctorTypeId: doc.doctorTypeId,
      hospitalId: doc.hospitalId,
      addressLine1: doc.addressLine1 || "",
      addressLine2: doc.addressLine2 || "",
      mapLink: doc.mapLink || "",
      about: doc.about || "",
      gallery: Array.isArray(doc.gallery) ? [...doc.gallery] : [],
      youtubeLink: doc.youtubeLink || "",
    });
    setImagePreview(doc.imageUrl || null);
    setEditingId(doc.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      fetchDoctors();
    } catch (err) {
      console.error("Failed to delete doctor:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    setIsImageUploading(true);
    try {
      const res = await uploadImage(form);
      const imageUrl = res.data.imageUrl;

      if (type === "profile") {
        setFormData((prev) => ({ ...prev, imageUrl }));
        setImagePreview(imageUrl);
      } else if (type === "gallery") {
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, imageUrl] }));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleGalleryDelete = (imgUrl) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img !== imgUrl),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        doctorName: formData.doctorName,
        experience: formData.experience,
        businessName: formData.hospital,
        rating: 0,
        imageUrl: formData.imageUrl,
        location: formData.location,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        doctorTypeId: formData.doctorTypeId,
        hospitalId: formData.hospitalId,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        mapLink: formData.mapLink,
        about: formData.about,
        youtubeLink: formData.youtubeLink,
        gallery: [...formData.gallery],
      };

      if (editingId) {
        await updateDoctor(editingId, payload);
      } else {
        await createDoctor(payload);
      }

      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      console.error("Failed to save doctor:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++)
      stars.push(<span key={`f${i}`} className="star full">★</span>);
    if (half)
      stars.push(<span key="h" className="star half">★</span>);
    for (let i = stars.length; i < 5; i++)
      stars.push(<span key={`e${i}`} className="star empty">★</span>);
    return stars;
  };

  return (
    <div className="hospital-doctors-page">
      <div className="header-row">
        <h1>Doctors Name</h1>
        <div className="actions">
          <button className="btn btn-add" onClick={handleAdd}>+ Create New</button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <form className="form-container" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Doctor" : "Add Doctor"}</h2>

            <label>Name *</label>
            <input name="doctorName" value={formData.doctorName} onChange={handleChange} required />

            <label>Experience *</label>
            <input name="experience" value={formData.experience} onChange={handleChange} required />

            <label>Hospital *</label>
            <input name="hospital" value={formData.hospital} onChange={handleChange} required />

            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />

            <label>WhatsApp</label>
            <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} />

            <label>Location</label>
            <input name="location" value={formData.location} onChange={handleChange} />

            <label>Address Line 1</label>
            <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} />

            <label>Address Line 2</label>
            <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} />

            <label>Map Link</label>
            <input name="mapLink" value={formData.mapLink} onChange={handleChange} />

            <label>YouTube Link</label>
            <input name="youtubeLink" value={formData.youtubeLink} onChange={handleChange} />

            <label>About</label>
            <textarea name="about" value={formData.about} onChange={handleChange}></textarea>

            <div className="form-group-custom">
              <label>Profile Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
              {isImageUploading && <span className="loading-spinner">Uploading...</span>}
              {imagePreview && !isImageUploading && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
            </div>

            <div className="form-group-custom">
              <label>Gallery</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gallery')} />
              {isImageUploading && <span className="loading-spinner">Uploading...</span>}
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
              <button type="button" className="btn-custom btn-cancel-custom" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="btn-custom btn-save-custom" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="doctors-list">
        {doctors.map((doc) => (
          <div key={doc.id} className="doctor-row">
            <div className="col image">
              <img src={doc.imageUrl || profile} alt={doc.doctorName} className="doctor-image" />
            </div>
            <div className="col name"><strong>{doc.doctorName}</strong></div>
            <div className="col experience">{doc.experience}</div>
            <div className="col hospital">{doc.businessName}</div>
            <div className="col rating">
              <div className="stars">
                {renderStars(parseFloat(doc.rating))}
                <span className="rating-num">{isNaN(parseFloat(doc.rating)) ? "0.0" : parseFloat(doc.rating).toFixed(1)}</span>
              </div>
            </div>
            <div className="col actions-col">
              <Link to={`/doctordetails/${doc.id}`} className="btn btn-details">Details</Link>
              <button className="btn btn-delete" onClick={() => handleDelete(doc.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <Link
        to={hospitalId ? `/hospital/${hospitalTypeId}` : doctorTypeId ? `/doctor` : '/'}
        className="back-link"
      >
        ← Back
      </Link>
    </div>
  );
}
