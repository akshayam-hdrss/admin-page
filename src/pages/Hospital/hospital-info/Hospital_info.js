


import React, { useState, useEffect } from "react";
import "./Hospital_info.css";
import {
  getHospitalInfo,
  addHospitalInfo,
  updateHospitalInfo,
  deleteHospitalInfo,
  uploadImage,
} from "../../../api/api";
import { useParams } from "react-router-dom";

const Hospital_info = () => {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emptyForm = {
    hospitalId: "",
    hospital_name: "",
    description: "",
    specialties: "",
    website: "",
    address: "",
    mission: "",
    vision: "",
    banner_img: null,
    ceo_name: "",
    ceo_image: null,
    nearest_location: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (hospitalId) fetchHospitalInfo(hospitalId);
  }, [hospitalId]);

  // Fetch hospital info by ID
  const fetchHospitalInfo = async (id) => {
    try {
      const res = await getHospitalInfo(id);
      const data = res.data?.data || null;
      setHospital(res.data); // use actual hospital object for UI

      if (data) {
        setFormData({
          hospitalId: data.hospitalId || "",
          hospital_name: data.hospital_name || "",
          description: data.description || "",
          specialties: data.specialties || "",
          website: data.website || "",
          address: data.address || "",
          mission: data.mission || "",
          vision: data.vision || "",
          banner_img: data.banner_img || null,
          ceo_name: data.ceo_name || "",
          ceo_image: data.ceo_image || null,
          nearest_location: data.nearest_location || "",
        });
      } else {
        setFormData(emptyForm);
      }
    } catch (err) {
      console.error("Error fetching hospital info:", err);
    }
  };

  // Save hospital info (Add / Update)
  const handleSave = async () => {
    try {
      let updatedData = { ...hospital, ...formData };

      updatedData.hospitalId = hospitalId;

      // Upload images only if new files selected
      if (formData.banner_img instanceof File) {
        const fdBanner = new FormData();
        fdBanner.append("image", formData.banner_img);
        const resBanner = await uploadImage(fdBanner);
        updatedData.banner_img = resBanner.data.imageUrl;
      }

      if (formData.ceo_image instanceof File) {
        const fdCeo = new FormData();
        fdCeo.append("image", formData.ceo_image);
        const resCeo = await uploadImage(fdCeo);
        updatedData.ceo_image = resCeo.data.imageUrl;
      }

      if (hospital) {
        // ✅ Send full updatedData to prevent nulls
        await updateHospitalInfo(hospitalId, updatedData);
      } else {
        await addHospitalInfo(updatedData);
      }

      await fetchHospitalInfo(hospitalId);
      closeModal();
    } catch (err) {
      console.error("Error saving hospital info:", err.response?.data || err.message);
    }
  };

  // Delete hospital info
  const handleDelete = async () => {
    if (window.confirm("Delete hospital info?")) {
      try {
        await deleteHospitalInfo(hospitalId);
        setHospital(null);
      } catch (err) {
        console.error("Error deleting hospital info:", err);
      }
    }
  };

  // Open modal and prefill form
  const openModal = () => {
    if (hospital) {
      setFormData({
        hospitalId: hospital.hospitalId || "",
        hospital_name: hospital.hospital_name || "",
        description: hospital.description || "",
        specialties: hospital.specialties || "",
        website: hospital.website || "",
        address: hospital.address || "",
        mission: hospital.mission || "",
        vision: hospital.vision || "",
        banner_img: hospital.banner_img || null,
        ceo_name: hospital.ceo_name || "",
        ceo_image: hospital.ceo_image || null,
        nearest_location: hospital.nearest_location || "",
      });
    } else {
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Input handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  return (
    <div className="hospital-container">
      <h1 className="hospital-title">Hospital Information</h1>

      <button onClick={openModal} className="hospital-btn hospital-btn-add">
        ➕ Add / Edit Info
      </button>

      {hospital ? (
        <div className="hospital-card">
          <p><strong>Specialties:</strong> {hospital.specialties}</p>
          <p><strong>Address:</strong> {hospital.address || "N/A"}</p>
          <p><strong>Vision:</strong> {hospital.vision || "N/A"}</p>
          <p><strong>Mission:</strong> {hospital.mission || "N/A"}</p>
          <p><strong>Description:</strong> {hospital.description}</p>
          <p>
            <strong>Map:</strong>{" "}
            <a href={hospital.website} target="_blank" rel="noreferrer">
              {hospital.website}
            </a>
          </p>
          <p><strong>Nearest Location:</strong> {hospital.nearest_location}</p>
          <p><strong>CEO:</strong> {hospital.ceo_name}</p>
          {hospital.ceo_image && <img src={hospital.ceo_image} alt="CEO" width="100" />}
          {hospital.banner_img && <img src={hospital.banner_img} alt="Banner" width="200" />}

          <div className="hospital-actions">
            <button onClick={openModal} className="hospital-btn hospital-btn-edit">✏️ Edit</button>
            <button onClick={handleDelete} className="hospital-btn hospital-btn-delete">🗑️ Delete</button>
          </div>
        </div>
      ) : (
        <p>No hospital info found. Please add one.</p>
      )}

      {isModalOpen && (
        <div className="hospital-modal-overlay">
          <div className="hospital-modal">
            <h2>{hospital ? "Edit Hospital Info" : "Add Hospital Info"}</h2>
            <form className="hospital-form">
              {["description","specialties","website","address","mission","vision","nearest_location","ceo_name"].map(field => (
                <React.Fragment key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1).replace("_"," ")}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </React.Fragment>
              ))}

              <label>CEO Image</label>
              <input type="file" name="ceo_image" onChange={handleFileChange} />
              {typeof formData.ceo_image === "string" && formData.ceo_image && (
                <img src={formData.ceo_image} alt="CEO" width="100" />
              )}

              <label>Banner Image</label>
              <input type="file" name="banner_img" onChange={handleFileChange} />
              {typeof formData.banner_img === "string" && formData.banner_img && (
                <img src={formData.banner_img} alt="Banner" width="200" />
              )}

              <div className="hospital-form-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="hospital-btn hospital-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="hospital-btn hospital-btn-save"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospital_info;
