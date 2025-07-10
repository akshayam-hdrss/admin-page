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
} from "../../../api/api"; // Ensure uploadImage is imported

export default function DoctorName() {
  const { hospitalTypeId, hospitalId, doctorTypeId } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    doctorName: "",
    experience: "",
    hospital: "",
    rating: "",
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
      rating: "",
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
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (doc) => {
    setFormData({
      doctorName: doc.doctorName,
      experience: doc.experience || "",
      hospital: doc.businessName,
      rating: doc.rating,
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
      gallery: doc.gallery || [],
      youtubeLink: doc.youtubeLink || "",
    });
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await uploadImage(form);
      const url = res.data.imageUrl;
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, url],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newGallery = [...prev.gallery];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await uploadImage(form);
      const imageUrl = res.data.imageUrl;
      setFormData((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      console.error("Image URL upload failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        businessName: formData.hospital,
        gallery: formData.gallery,
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
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++)
      stars.push(
        <span key={`f${i}`} className="star full">
          ★
        </span>
      );
    if (half)
      stars.push(
        <span key="h" className="star half">
          ★
        </span>
      );
    for (let i = stars.length; i < 5; i++)
      stars.push(
        <span key={`e${i}`} className="star empty">
          ★
        </span>
      );
    return stars;
  };

  return (
    <div className="hospital-doctors-page">
      <div className="header-row">
        <h1>Doctors Name</h1>
        <div className="actions">
          <button className="btn btn-add" onClick={handleAdd}>
            + Create New
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <form className="form-container" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Doctor" : "Add Doctor"}</h2>

            <label>Name *</label>
            <input
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
            />

            <label>Experience *</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />

            <label>Hospital *</label>
            <input
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              required
            />

            {/* <label>Rating</label>
            <input name="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} /> */}

            <label>Image URL</label>
            <div className="d-flex align-items-center gap-2">
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Paste URL or upload"
                className="form-control"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="form-control-file"
              />
            </div>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Main"
                width={100}
                height={100}
                style={{ marginTop: "10px", borderRadius: "8px" }}
              />
            )}

            <label>Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>WhatsApp</label>
            <input
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
            />

            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <label>Gallery</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <div className="gallery-preview">
              {formData.gallery.map((img, index) => (
                <div key={index} className="gallery-image">
                  <img
                    src={img}
                    alt={`Gallery ${index}`}
                    width={80}
                    height={80}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="doctors-list">
        {doctors.map((doc) => (
          <div key={doc.id} className="doctor-row">
            <div className="col image">
              <img
                src={doc.imageUrl || profile}
                alt={doc.doctorName}
                className="doctor-image"
              />
            </div>
            <div className="col name">
              <strong>{doc.doctorName}</strong>
            </div>
            <div className="col experience">{doc.experience}</div>
            <div className="col hospital">{doc.businessName}</div>
            <div className="col rating">
              <div className="stars">
                {renderStars(parseFloat(doc.rating))}
                <span className="rating-num">
                  {isNaN(parseFloat(doc.rating))
                    ? "0.0"
                    : parseFloat(doc.rating).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="col actions-col">
              <Link to={`/doctordetails/${doc.id}`} className="btn btn-details">
                Details
              </Link>
              {/* <button className="btn btn-edit" onClick={() => handleEdit(doc)}>✏</button> */}
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(doc.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link
  to={
    hospitalId
      ? `/hospital/${hospitalTypeId}`
      : doctorTypeId
      ? `/doctor`
      : '/'
  }
  className="back-link"
>
  ← Back
</Link>
    </div>
  );
}
