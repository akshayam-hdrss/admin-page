import React, { useState, useEffect } from "react";
import "./ServicePage.css";
import {
//   getServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType,
  uploadImage,
  getServiceTypesByAvailableService,
} from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import AdManagement from "../../components/AdManagement/AdManagement";

export default function ServicePage1() {
  const [services, setServices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { availableServiceId } = useParams();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServiceTypesByAvailableService(availableServiceId);
      setServices(response.data.resultData);
    } catch {
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

    // ✅ Wrap the file in FormData before sending
    const formData = new FormData();
    formData.append("image", file);

    const response = await uploadImage(formData);

    // ✅ Set uploaded image URL into form state
    setForm((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
  } catch (err) {
    console.error("Image upload error:", err.response?.data || err.message);
    alert("Image upload failed");
  } finally {
    setUploading(false);
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...form,
      availableServiceId: parseInt(availableServiceId), // get from URL params
    };

    if (isEditing) {
      await updateServiceType({ id: editId, ...payload });
    } else {
      await createServiceType(payload);
    }

    resetForm();
    fetchServices();
  } catch {
    alert("Failed to save service");
  }
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
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteServiceType(id);
      fetchServices();
    } catch {
      alert("Failed to delete service");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all services?")) return;
    try {
      await Promise.all(services.map((service) => deleteServiceType(service.id)));
      fetchServices();
    } catch {
      alert("Failed to delete all");
    }
  };

  return (
    <>
     <AdManagement category="services" typeId={null} itemId={null} />
    <div className="category-page">
      <div className="category-header">
        <h1>Service Management</h1>
        <div>
          <button className="btn btn-add" onClick={() => setIsFormOpen(true)}>
            + Add Service
          </button>
          <button className="btn btn-delete-all" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      </div>

      {/* Modal Form */}
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
                placeholder="Enter service name"
                required
              />
              <div className="image-upload">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {uploading && <p>Uploading image...</p>}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
              </div>
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
            <div className="category-card"  onClick={() => navigate(`/service/${availableServiceId}/${service.id}`)}>
              {service.imageUrl && (
                <div className="category-images">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="category-image"
                    style={{ cursor: "pointer" }}
                   
                  />
                </div>
              )}
              <div className="category-details">
                <h3>{service.name}</h3>
              </div>
            </div>
            <div className="category-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(service)}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(service.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
