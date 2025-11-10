import React, { useState, useEffect } from "react";
import axios from "axios";

// API functions
const BASE_URL = "https://medbook-backend-1.onrender.com/api";

const uploadImage = (formData) => {
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getEvents = () => {
  return axios.get(`${BASE_URL}/event`);
};

const createEvent = (event) => {
  return axios.post(`${BASE_URL}/event`, event);
};

const updateEvent = (id, event) => {
  return axios.put(`${BASE_URL}/event/${id}`, event);
};

const deleteEvent = (id) => {
  return axios.delete(`${BASE_URL}/event/${id}`);
};

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [uploading, setUploading] = useState({
    banner: false,
    gallery: false
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner_image: '',
    youtubeLink: '',
    gallery: []
  });

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents();
        setEvents(response.data.resultData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle banner image upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    try {
      setUploading({ ...uploading, banner: true });
      const res = await uploadImage(form);
      setFormData({
        ...formData,
        banner_image: res.data.imageUrl
      });
    } catch (err) {
      setError("Banner image upload failed");
      console.error("Upload error:", err);
    } finally {
      setUploading({ ...uploading, banner: false });
    }
  };

  // Handle gallery images upload
  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading({ ...uploading, gallery: true });
      const uploadPromises = Array.from(files).map(async (file) => {
        const form = new FormData();
        form.append("image", file);
        const res = await uploadImage(form);
        return res.data.imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({
        ...formData,
        gallery: [...formData.gallery, ...uploadedUrls]
      });
    } catch (err) {
      setError("Gallery image upload failed");
      console.error("Upload error:", err);
    } finally {
      setUploading({ ...uploading, gallery: false });
    }
  };

  // Remove gallery item
  const handleRemoveGalleryItem = (index) => {
    const updatedGallery = [...formData.gallery];
    updatedGallery.splice(index, 1);
    setFormData({ ...formData, gallery: updatedGallery });
  };

  // Open modal for creating new event
  const handleCreate = () => {
    setCurrentEvent(null);
    setFormData({
      title: '',
      description: '',
      banner_image: '',
      youtubeLink: '',
      gallery: []
    });
    setShowModal(true);
  };

  // Open modal for editing existing event
  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      banner_image: event.banner_image,
      youtubeLink: event.youtubeLink,
      gallery: [...event.gallery]
    });
    setShowModal(true);
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEvent) {
        // Update existing event
        await updateEvent(currentEvent.id, formData);
      } else {
        // Create new event
        await createEvent(formData);
      }
      // Refresh events list
      const response = await getEvents();
      setEvents(response.data.resultData);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        // Refresh events list
        const response = await getEvents();
        setEvents(response.data.resultData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 mt-3">
        Error: {error}
        <button 
          className="btn-close float-end" 
          onClick={() => setError(null)}
        ></button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Event Management</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {events.map(event => (
          <div key={event.id} className="col">
            <div className="card h-100 shadow-sm">
              <img 
                src={event.banner_image} 
                className="card-img-top" 
                alt={event.title}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text text-muted">
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...` 
                    : event.description}
                </p>
                
                {event.youtubeLink && (
                  <div className="mb-2">
                    <a 
                      href={event.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-danger"
                    >
                      <i className="bi bi-youtube me-1"></i> YouTube
                    </a>
                  </div>
                )}

                {event.gallery && event.gallery.length > 0 && (
                  <div className="mb-3">
                    <small className="text-muted">Gallery ({event.gallery.length} images)</small>
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {event.gallery.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          className="img-thumbnail"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          alt={`Gallery ${index + 1}`}
                        />
                      ))}
                      {event.gallery.length > 3 && (
                        <div 
                          className="bg-light d-flex align-items-center justify-content-center rounded"
                          style={{ width: "50px", height: "50px" }}
                        >
                          +{event.gallery.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="card-footer bg-white border-top-0">
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(event)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(event.id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentEvent ? "Edit Event" : "Create New Event"}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Banner Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={uploading.banner}
                    />
                    {uploading.banner ? (
                      <div className="mt-2">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Uploading...</span>
                        </div>
                        <span className="ms-2">Uploading banner...</span>
                      </div>
                    ) : formData.banner_image ? (
                      <div className="mt-2">
                        <img
                          src={formData.banner_image}
                          className="img-thumbnail"
                          style={{ maxHeight: "150px" }}
                          alt="Banner Preview"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">YouTube Link</label>
                    <input
                      type="url"
                      className="form-control"
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Gallery Images</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      disabled={uploading.gallery}
                      multiple
                    />
                    {uploading.gallery && (
                      <div className="mt-2">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Uploading...</span>
                        </div>
                        <span className="ms-2">Uploading gallery images...</span>
                      </div>
                    )}
                    
                    <div className="border rounded p-2 mt-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
                      {formData.gallery.length > 0 ? (
                        formData.gallery.map((img, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                            <img
                              src={img}
                              className="img-thumbnail"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              alt={`Gallery ${index + 1}`}
                            />
                            <small className="text-truncate mx-2" style={{ flex: 1 }}>
                              {img.substring(0, 30)}...
                            </small>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveGalleryItem(index)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))
                      ) : (
                        <small className="text-muted">No gallery images added</small>
                      )}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={uploading.banner || uploading.gallery}
                    >
                      {currentEvent ? "Save Changes" : "Create Event"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;