import React, { useState, useEffect } from "react";
import "./ServicePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const API =
    "https://medbook-backend-1.onrender.com/api/services/available-services";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(API);
      setServices(res.data.resultData || []);
    } catch (err) {
      alert("Failed to fetch services");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        "https://medbook-backend-1.onrender.com/api/upload",
        formData
      );
      setForm((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API}/${editId}`, form);
      } else {
        await axios.post(API, form);
      }
      resetForm();
      fetchServices();
    } catch {
      alert("Failed to save service");
    }
  };

  const handleCategoryClick = (id) => {
    navigate(`/service/${id}`);
  };

  const resetForm = () => {
    setForm({ name: "", imageUrl: "" });
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (service) => {
    setForm({ name: service.name, imageUrl: service.imageUrl });
    setImagePreview(service.imageUrl);
    setIsEditing(true);
    setEditId(service.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchServices();
    } catch {
      alert("Failed to delete service");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all services?"))
      return;
    try {
      await Promise.all(
        services.map((service) => axios.delete(`${API}/${service.id}`))
      );
      fetchServices();
    } catch {
      alert("Failed to delete all");
    }
  };

  return (
    <div className="service-page">
      <div className="service-header">
        <h1>Service Management</h1>
        <div>
          <button className="service-btn service-btn-add" onClick={() => setIsFormOpen(true)}>
            + Add Service
          </button>
          <button className="service-btn service-btn-delete-all" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="service-form-overlay">
          <div className="service-form-container">
            <h2>{isEditing ? "Edit Service" : "Add New Service"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter service name"
                required
              />
              <div className="service-image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {uploading && <p>Uploading image...</p>}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="service-image-preview"
                  />
                )}
              </div>
              <div className="service-form-actions">
                <button
                  type="button"
                  className="service-btn service-btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="service-btn service-btn-save">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="service-list">
        {services.map((service) => (
          <li key={service.id} className="service-item">
            <div className="service-card" onClick={() => handleCategoryClick(service.id)}>
              {service.imageUrl && (
                <div className="service-images">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="service-image"
                  />
                </div>
              )}
              <div className="service-details">
                <h3>{service.name}</h3>
              </div>
            </div>
            <div className="service-actions">
              <button
                className="service-btn service-btn-edit"
                onClick={() => handleEdit(service)}
              >
                Edit
              </button>
              <button
                className="service-btn service-btn-delete"
                onClick={() => handleDelete(service.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
