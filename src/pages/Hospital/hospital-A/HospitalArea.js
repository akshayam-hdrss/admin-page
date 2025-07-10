import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getHospitalsByType,
  createHospital,
  updateHospital,
  deleteHospital,
} from "../../../api/api";
import "./HospitalArea.css";

const HospitalArea = () => {
  const { hospitalTypeId } = useParams();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hospitalData, setHospitalData] = useState({
    name: "",
    imageUrl: "",
    area: "",
    mapLink: "",
    phone: "",
    hospitalTypeId: hospitalTypeId,
  });

  const [showForm, setShowForm] = useState(false);
  const [editHospitalId, setEditHospitalId] = useState(null);

  useEffect(() => {
    console.log(hospitalTypeId);
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await getHospitalsByType(hospitalTypeId);
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

    try {
      let response;
      if (editHospitalId) {
        response = await updateHospital({
          id: editHospitalId,
          ...hospitalData,
        });
      } else {
        response = await createHospital(hospitalData);
      }

      // Refresh the hospital list
      const updatedResponse = await getHospitalsByType(hospitalTypeId);
      setHospitals(updatedResponse.data.resultData);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await deleteHospital(hospitalId);
        const updatedResponse = await getHospitalsByType(hospitalTypeId);
        setHospitals(updatedResponse.data.resultData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading hospitals...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="hospital-area-wrapper">
      <h1 className="hospital-page-title">HOSPITALS</h1>

      <button
        className="hospital-btn hospital-btn-add"
        onClick={handleAddHospital}
      >
        + Add Hospital
      </button>

      <div className="hospital-list-wrapper">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <div key={hospital.id} className="hospital-card-container">
              {hospital.imageUrl && (
                <img
                  src={hospital.imageUrl}
                  alt={hospital.name}
                  className="hospital-image"
                />
              )}

              <div className="hospital-card-header">
                <h3 className="hospital-name">{hospital.name}</h3>
              </div>

              <p className="hospital-area">
                <strong>Area:</strong> {hospital.area}
              </p>
              <p className="hospital-contact">
                <strong>Phone:</strong> {hospital.phone}
              </p>

              {hospital.mapLink && (
                <a
                  href={hospital.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hospital-map-link"
                >
                  View on Map
                </a>
              )}

              <div className="hospital-card-actions">
                <Link
                  to={`/hospital/${hospitalTypeId}/${hospital.id}`}
                  className="hospital-btn hospital-btn-details"
                >
                  View Doctors
                </Link>

                <button
                  className="hospital-btn hospital-btn-edit"
                  onClick={() => handleEditHospital(hospital.id)}
                >
                  Edit
                </button>
                <button
                  className="hospital-btn hospital-btn-delete"
                  onClick={() => handleDeleteHospital(hospital.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-hospitals">No hospitals found for this type.</p>
        )}
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editHospitalId ? "Edit Hospital" : "Add Hospital"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={hospitalData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={hospitalData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label>Area</label>
                <input
                  type="text"
                  name="area"
                  value={hospitalData.area}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Map Link</label>
                <input
                  type="url"
                  name="mapLink"
                  value={hospitalData.mapLink}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={hospitalData.phone}
                  onChange={handleInputChange}
                  placeholder="+971-123456789"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="hospital-btn hospital-btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hospital-btn hospital-btn-save"
                >
                  {editHospitalId ? "Save Changes" : "Add Hospital"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Link to={`/hospital`} className="back-link">
        ← Back to Categories
      </Link>
    </div>
  );
};

export default HospitalArea;
