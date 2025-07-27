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
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/api";

export default function DoctorName() {
  const { hospitalTypeId, hospitalId, doctorTypeId } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryText, setEditingCategoryText] = useState("");


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
    bannerUrl: "",
    degree: "",
    district: "",      // <-- Added
    pincode: "",       // <-- Added
  });
  const [categories, setCategories] = useState([]);
  const [newCategoryText, setNewCategoryText] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");



  // useEffect(() => {
  //   fetchDoctors();
  // }, [hospitalId]);

  useEffect(() => {
    fetchDoctors();
  }, [hospitalId]);

// const handleCreateCategory = async () => {
//   if (!newCategoryText) return;
//   try {
//     await createCategory({ text: newCategoryText.trim(), hospitalId: Number(hospitalId) });
//     setNewCategoryText("");
//     setShowCategoryInput(false);
//     // fetchCategories();
//     fetchDoctors();
//   } catch (err) {
//     console.error("Failed to add category:", err);
//   }
// };

const handleCreateCategory = async () => {
  if (!newCategoryText.trim()) return;

  try {
    if (editingCategoryId) {
      await updateCategory(editingCategoryId, {
        text: newCategoryText.trim(),
        hospitalId: Number(hospitalId),
      });
    } else {
      await createCategory({ text: newCategoryText.trim(), hospitalId: Number(hospitalId) });
    }

    setNewCategoryText("");
    setEditingCategoryId(null);
    setShowCategoryInput(false);
    fetchDoctors(); // This also refreshes the categories
  } catch (err) {
    console.error("Failed to save category:", err);
  }
};

const handleEditCategory = (cat) => {
  setShowCategoryInput(true);
  setNewCategoryText(cat.text);
  setEditingCategoryId(cat.id);
};

const handleDeleteCategory = async (catId) => {
  try {
    await deleteCategory(catId);
    fetchDoctors(); // Refresh categories after deletion
  } catch (err) {
    console.error("Failed to delete category:", err);
  }
};


  const fetchDoctors = async () => {
  try {
    const res = await getDoctors({ hospitalId, doctorTypeId });
    setDoctors(res.data.resultData || []);
    setCategories(res.data.category || []);
  } catch (err) {
    console.error("Failed to fetch doctors:", err);
    setDoctors([]);
    setCategories([]);
  }
};
const groupDoctorsByCategory = () => {
  const grouped = {};

  doctors.forEach((doc) => {
    const doctorCategory = doc.businessName?.trim();
    const isValidCategory = categories.some(cat => cat.text.trim() === doctorCategory);
    const categoryKey = isValidCategory ? doctorCategory : "Other";
    console.log(categories, doctorCategory );

    if (!grouped[categoryKey]) grouped[categoryKey] = [];
    grouped[categoryKey].push(doc);
  });

  return grouped;
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
      bannerUrl: "",
      degree: "",
      district: "",    // <-- Added
      pincode: "",     // <-- Added
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
      bannerUrl: doc.bannerUrl || "",
      degree: doc.degree || "",
      district: doc.district || "",    // <-- Added
      pincode: doc.pincode || "",      // <-- Added
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
    } else if (type === "banner") {
      setFormData((prev) => ({ ...prev, bannerUrl: imageUrl }));
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
        bannerUrl: formData.bannerUrl,
        degree: formData.degree,
        district: formData.district,    // <-- Added
        pincode: formData.pincode,      // <-- Added
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
     <div
  className="header-row"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
  <h1>Doctors Name</h1>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    {hospitalId && (
  <div className="d-flex flex-column gap-2 w-100">

    {/* Custom Dropdown */}
    <div className="dropdown">
      <button
        className="btn btn-light border dropdown-toggle text-start w-100"
        type="button"
        id="categoryDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedCategory || "Select Category"}
      </button>
      <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="dropdown-item d-flex justify-content-between align-items-center"
            onClick={() => setSelectedCategory(cat.text)}
          >
            <span>{cat.text}</span>
            <span>
              <button
                className="btn btn-sm btn-outline-primary me-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(cat);
                  const dropdownEl = document.getElementById("categoryDropdown");
if (dropdownEl && window.bootstrap) {
  const dropdown = window.bootstrap.Dropdown.getInstance(dropdownEl);
  if (dropdown) dropdown.hide();
}

                }}
                
              >
                ✏️
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(cat.id);
                }}
              >
                🗑
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Add / Edit Input */}
    {showCategoryInput && (
      <div className="d-flex gap-2 align-items-center mt-2">
        <input
          type="text"
          value={newCategoryText}
          onChange={(e) => setNewCategoryText(e.target.value)}
          placeholder="New Category"
          className="form-control"
        />
        <button
          className="btn btn-success"
          type="button"
          onClick={handleCreateCategory}
        >
          {editingCategoryId ? "Update" : "Add"}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => {
            setShowCategoryInput(false);
            setNewCategoryText("");
            setEditingCategoryId(null);
          }}
        >
          Cancel
        </button>
      </div>
    )}

    {!showCategoryInput && (
      <button
        className="btn btn-sm btn-outline-secondary mt-2"
        type="button"
        onClick={() => {
          setShowCategoryInput(true);
          setNewCategoryText("");
          setEditingCategoryId(null);
        }}
      >
        + Add Category
      </button>
    )}
  </div>
)}



    <button className="btn btn-primary" onClick={handleAdd}>
      + Create Doctor
    </button>
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
            <label>Degree</label>
            <input name="degree" value={formData.degree} onChange={handleChange} />

            <label>District</label> {/* <-- Added */}
            <input name="district" value={formData.district} onChange={handleChange} />

            <label>Pincode</label> {/* <-- Added */}
            <input name="pincode" value={formData.pincode} onChange={handleChange} />


{hospitalId ? (
  <>
    <label>Category *</label>
    <select
      name="hospital"
      value={formData.hospital}
      onChange={handleChange}
      required
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.text}>{cat.text}</option>
      ))}
    </select>

    {showCategoryInput ? (
      <div style={{ display: "flex", marginTop: "5px" }}>
        <input
          type="text"
          value={newCategoryText}
          onChange={(e) => setNewCategoryText(e.target.value)}
          placeholder="New Category"
        />
        <button type="button" onClick={handleCreateCategory}>Add</button>
      </div>
    ) : (
      <button
        type="button"
        className="btn btn-sm btn-secondary"
        onClick={() => setShowCategoryInput(true)}
      >
        + Add Category
      </button>
    )}
  </>
) : doctorTypeId ? (
  <>
    <label>Business Name *</label>
    <input
      name="hospital"
      value={formData.hospital}
      onChange={handleChange}
      required
    />
  </>
) : null}


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
              <label>Banner Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
              {isImageUploading && <span className="loading-spinner">Uploading...</span>}
              {formData.bannerUrl && !isImageUploading && (
                <img src={formData.bannerUrl} alt="Banner Preview" className="image-preview" />
              )}
            </div>


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

      {doctorTypeId ? (
  // Show flat list if doctorTypeId is present
  <div className="doctors-list">
    {doctors.map((doc) => (
      <div key={doc.id} className="doctor-row">
        <div className="col image">
          <img src={doc.imageUrl || profile} alt={doc.doctorName} className="doctor-image" />
        </div>
        <div className="col name"><strong>{doc.doctorName}</strong></div>
        <div className="col degree">{doc.degree}</div>
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
          <button className="btn btn-edit" onClick={() => handleEdit(doc)}>✏️</button>
          <button className="btn btn-delete" onClick={() => handleDelete(doc.id)}>🗑</button>
        </div>
      </div>
    ))}
  </div>
) : hospitalId ? (
  // Show grouped list if hospitalId is present
  <div className="doctors-list">
    {Object.entries(groupDoctorsByCategory()).map(([category, docs]) => (
      <div key={category} className="category-group">
        <h2 className="category-title">{category}</h2>
        {docs.map((doc) => (
          <div key={doc.id} className="doctor-row">
            <div className="col image">
              <img src={doc.imageUrl || profile} alt={doc.doctorName} className="doctor-image" />
            </div>
            <div className="col name"><strong>{doc.doctorName}</strong></div>
            <div className="col degree">{doc.degree}</div>
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
              <button className="btn btn-edit" onClick={() => handleEdit(doc)}>✏️</button>
              <button className="btn btn-delete" onClick={() => handleDelete(doc.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
) : (
  // Fallback message or nothing
  <div>No doctors to display</div>
)}



      <Link
        to={hospitalId ? `/hospital/${hospitalTypeId}` : doctorTypeId ? `/doctor` : '/'}
        className="back-link"
      >
        ← Back
      </Link>
    </div>
  );
}

