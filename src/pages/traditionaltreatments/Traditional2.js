import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getTraditionalByType,
  createTraditional,
  updateTraditional,
  deleteTraditional,
  uploadImage,
} from "../../api/api";
import "../Hospital/hospital-A/HospitalArea.css";
import AdManagement from "../../components/AdManagement/AdManagement";

const Traditional2 = () => {
  const { hospitalTypeId } = useParams();
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState(null);

  const [hospitalData, setHospitalData] = useState({
    name: "",
    imageUrl: "",
    area: "",
    mapLink: "",
    phone: "",
    hospitalTypeId: hospitalTypeId,
    address1: "",
    address2: "",
    district: "",
    pincode: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editHospitalId, setEditHospitalId] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await getTraditionalByType(hospitalTypeId);
        setHospitals(response.data.resultData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [hospitalTypeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    try {
      setLoadingImage(true);
      const res = await uploadImage(form);
      const imageUrl = res.data.imageUrl;
      setHospitalData((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      alert("Image upload failed");
      console.error("Upload error:", err);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleAddHospital = () => {
    setShowForm(true);
    setEditHospitalId(null);
    setHospitalData({
      name: "",
      imageUrl: "",
      area: "",
      mapLink: "",
      phone: "",
      hospitalTypeId: hospitalTypeId,
      address1: "",
      address2: "",
      district: "",
      pincode: "",
    });
  };

  const handleEditHospital = (hospitalId) => {
    setShowForm(true);
    setEditHospitalId(hospitalId);
    const hospitalToEdit = hospitals.find((h) => h.id === hospitalId);
    setHospitalData(hospitalToEdit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hospitalData.name) {
      alert("Hospital name is required!");
      return;
    }
    if (!hospitalData.hospitalTypeId){
      alert("Hospital Type ID is required!");
      return;
    }

    try {
      if (editHospitalId) {
        await updateTraditional({ id: editHospitalId, ...hospitalData });
      } else {
        await createTraditional(hospitalData);
      }
      const updatedResponse = await getTraditionalByType(hospitalTypeId);
      setHospitals(updatedResponse.data.resultData);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await deleteTraditional(hospitalId);
        const updatedResponse = await getTraditionalByType(hospitalTypeId);
        setHospitals(updatedResponse.data.resultData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

   // ✅ Show loading spinner before content
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
  if (error) return <div className="ha-error">Error: {error}</div>;

  return (
    <div className="ha-wrapper">
      <AdManagement category="hosptial" typeId={hospitalTypeId} itemId={null} />
    <div className="ha-container">

      <h1 className="ha-title">HOSPITALS</h1>

      <button className="ha-btn ha-btn-add" onClick={handleAddHospital}>
        + Add Hospital
      </button>

      <div className="ha-list">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <div key={hospital.id} className="ha-card">
              {hospital.imageUrl && (
                <img src={hospital.imageUrl} alt={hospital.name} />
              )}
              <h3 className="ha-name">{hospital.name}</h3>
              <p className="ha-info"><strong>Area:</strong> {hospital.area}</p>
              <p className="ha-info"><strong>Phone:</strong> {hospital.phone}</p>

              {hospital.mapLink && (
                <a href={hospital.mapLink} target="_blank" rel="noopener noreferrer" className="ha-map-link">
                  View on Map
                </a>
              )}

              <div className="ha-actions">
                <Link to={`/traditional/${hospitalTypeId}/${hospital.id}`} className="ha-btn ha-btn-view">
                  View Doctors
                </Link>
                <button className="ha-btn ha-btn-edit" onClick={() => handleEditHospital(hospital.id)}>
                  Edit
                </button>
                <button className="ha-btn ha-btn-delete" onClick={() => handleDeleteHospital(hospital.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="ha-info">No hospitals found for this type.</p>
        )}
      </div>

      {showForm && (
        <div className="ha-modal-overlay">
          <div className="ha-modal">
            <h2>{editHospitalId ? "Edit Hospital" : "Add Hospital"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="ha-field">
                <label>Name *</label>
                <input type="text" name="name" value={hospitalData.name} onChange={handleInputChange} required />
              </div>

              <div className="ha-field">
                <label>Upload Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {loadingImage ? (
                  <p>Uploading...</p>
                ) : (
                  hospitalData.imageUrl && <img src={hospitalData.imageUrl} alt="Preview" style={{ width: "80px", marginTop: "10px" }} />
                )}
              </div>

              <div className="ha-field">
                <label>Area</label>
                <input type="text" name="area" value={hospitalData.area} onChange={handleInputChange} />
              </div>

              <div className="ha-field">
                <label>Map Link</label>
                <input type="url" name="mapLink" value={hospitalData.mapLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." />
              </div>

              <div className="ha-field">
                <label>Phone</label>
                <input type="tel" name="phone" value={hospitalData.phone} onChange={handleInputChange} placeholder="+971-123456789" />
              </div>

              <div className="ha-field">
                <label>Address Line 1</label>
                <input type="text" name="address1" value={hospitalData.address1} onChange={handleInputChange} />
              </div>

              <div className="ha-field">
                <label>Address Line 2</label>
                <input type="text" name="address2" value={hospitalData.address2} onChange={handleInputChange} />
              </div>

              <div className="ha-field">
                <label>District</label>
                <input type="text" name="district" value={hospitalData.district} onChange={handleInputChange} />
              </div>

              <div className="ha-field">
                <label>Pincode</label>
                <input type="text" name="pincode" value={hospitalData.pincode} onChange={handleInputChange} />
              </div>
              <div className="ha-field">
                <label>Hospital Type ID</label>
                <input type="text" name="hospitalTypeId" value={hospitalData.hospitalTypeId} readOnly />
              </div>


              <div className="ha-form-actions">
                <button type="button" className="ha-btn ha-btn-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="ha-btn ha-btn-save">
                  {editHospitalId ? "Save Changes" : "Add Hospital"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Link to="/hospital" className="ha-back">← Back to Categories</Link>
    </div>
    </div>
  );
};

export default Traditional2;