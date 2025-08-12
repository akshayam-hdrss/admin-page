import React, { useEffect, useState } from "react";
import {
  getAvailableServiceTypes,
  createAvailableServiceType,
  updateAvailableServiceType,
  deleteAvailableServiceType,
  uploadImage,
} from "../../api/api.js";
import "./ServicePage.css";
import { useNavigate} from "react-router-dom";

export default function ServicePage0() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", imageUrl: "", order_no: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate()


  useEffect(() => {
    fetchServices();
  }, []);

 const fetchServices = async () => {
  try {
    const res = await getAvailableServiceTypes();
    const sorted = res.data.resultData.sort((a, b) => a.order_no - b.order_no);
    setServices(sorted);
  } catch {
    alert("Failed to load available services");
  }
};


  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData);
      setForm((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateAvailableServiceType({ id: editId, ...form });
      } else {
        await createAvailableServiceType(form);
      }
      resetForm();
      fetchServices();
    } catch {
      alert("Failed to save service");
    }
  };

  const handleEdit = (service) => {
    setForm({ name: service.name, imageUrl: service.imageUrl,order_no: service.order_no  });
    setImagePreview(service.imageUrl);
    setIsEditing(true);
    setEditId(service.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this service?")) return;
    try {
      await deleteAvailableServiceType(id);
      fetchServices();
    } catch {
      alert("Failed to delete");
    }
  };

  const resetForm = () => {
    setForm({ name: "", imageUrl: "" });
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(false);
  };
  const handlenavigate =(id)=>{
    navigate(`/service/${id}`)
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Available Services</h1>
        <button className="btn btn-add" onClick={() => setIsFormOpen(true)}>
          + Add New
        </button>
      </div>

      {isFormOpen && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{isEditing ? "Edit Service" : "Add New Service"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Service name"
                required
              />
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {uploading && <p>Uploading image...</p>}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              )}
              <input
                type="number"
                name="order_no"
                value={form.order_no}
                onChange={handleInputChange}
                placeholder="Order number"
                required
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-save">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="category-list">
        {services.map((service) => (
  <li key={service.id} className="category-item">
    <div className="category-card" onClick={() => handlenavigate(service.id)}>
      {service.imageUrl && (
        <img
          src={service.imageUrl}
          alt={service.name}
          className="category-image"
        />
      )}
      <div className="category-details">
        <h3>{service.name}</h3>
      </div>
      <div className="category-order">
        <h6>order no: {service.order_no}</h6>
      </div>
    </div>
    <div className="category-actions">
      <button className="btn btn-edit" onClick={() => handleEdit(service)}>
        Edit
      </button>
      <button className="btn btn-delete" onClick={() => handleDelete(service.id)}>
        Delete
      </button>
    </div>
  </li>
))}
      </ul>
    </div>
  );
}
