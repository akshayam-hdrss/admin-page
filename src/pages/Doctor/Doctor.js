import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Doctor.css';
import { getDoctorTypes, createDoctorType, updateDoctorType, deleteDoctorType, uploadImage } from '../../api/api.js'; // Import API functions
import AdManagement from '../../components/AdManagement/AdManagement.js';

const Doctor = () => {
  const [categories, setCategories] = useState([]); // Categories fetched from the backend
  const [isFormOpen, setIsFormOpen] = useState(false); // Track if form is open (for adding or editing)
  const [newCategory, setNewCategory] = useState({ name: '', imageUrl: '', path: '' });
  const [editIndex, setEditIndex] = useState(null); // Store index of category being edited (for edit mode)
  const [imagePreview, setImagePreview] = useState(null); // Store image preview for the uploaded file

  // Fetch categories from the backend when the component mounts
  const fetchCategories = async () => {
    try {
      const response = await getDoctorTypes(); // Fetch categories from API
      setCategories(response.data.resultData); // Update state with fetched categories
    } catch (error) {
      console.error('Error fetching doctor categories:', error);
    }
  };

  // Fetch categories only once on mount
  useEffect(() => {
    fetchCategories();
  }, []); // Only run once when the component mounts

  // Handle delete category with alert
  const deleteCategory = async (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      try {
        const categoryId = categories[index].id;
        await deleteDoctorType(categoryId); // API call to delete category
        fetchCategories(); // Re-fetch categories after deletion
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // Handle file change (for image upload)
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview (base64)
      };
      reader.readAsDataURL(file); // Read file as base64

      try {
        // Upload image to the server
        const formData = new FormData();
        formData.append('image', file); // Append the selected image to form data
        const response = await uploadImage(formData); // API call to upload image
        setNewCategory({ ...newCategory, imageUrl: response.data.imageUrl }); // Set the image URL from the backend
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Handle form submission (both add and edit)
  const handleFormSubmit = async () => {
    try {
      if (editIndex !== null) {
        // If we're in edit mode
        const categoryId = categories[editIndex].id;
        await updateDoctorType(categoryId, newCategory); // API call to update category
        fetchCategories(); // Re-fetch categories after update
      } else {
        // If we're adding a new category
        await createDoctorType(newCategory); // API call to add category
        fetchCategories(); // Re-fetch categories after addition
      }
      setIsFormOpen(false); // Close the form after submission
      setNewCategory({ name: '', imageUrl: '', path: '' }); // Reset the form
      setImagePreview(null); // Reset image preview
      setEditIndex(null); // Reset edit index
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Open the form to edit a category
  const openEditForm = (index) => {
    const categoryToEdit = categories[index];
    setNewCategory(categoryToEdit);
    setImagePreview(categoryToEdit.imageUrl); // Set the preview with the existing image
    setEditIndex(index);
    setIsFormOpen(true);
  };

  // Open the form to add a new category
  const openAddForm = () => {
    setNewCategory({ name: '', imageUrl: '', path: '' }); // Reset the form to empty fields
    setImagePreview(null); // Clear image preview
    setEditIndex(null); // Make sure we're not in edit mode
    setIsFormOpen(true);
  };

  return (
  <>
      <AdManagement category="doctor" typeId={null} itemId={null} />
      <div className="doctor-container">
      <div className="doctor-header">
        <h1 className="doctor-title">Doctor Categories</h1>
        <button className="doctor-add-btn" onClick={openAddForm}>Add Category</button>
      </div>

      {/* Category Form (Add or Edit) */}
      {isFormOpen && (
        <div className="add-category-form">
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Category Name"
            className="input-field"
          />
          {/* Image Upload */}
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-field file-input"
              required
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
          </div>
          <div className="form-buttons">
            <button className="submit-btn" onClick={handleFormSubmit}>
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
            <button className="cancel-btn" onClick={() => setIsFormOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="doctor-category-grid">
        {categories.map((category, index) => (
          <div key={index} className="doctor-category">
            <Link to={`/doctor/${category.id}`} className="doctor-category-link">
              <img src={category.imageUrl} alt={category.name} className="doctor-category-img" />
              <h2>{category.name}</h2>
            </Link>
            <button
              className="doctor-edit-btn"
              onClick={() => openEditForm(index)}
            >
              Edit
            </button>
            <button
              className="doctor-delete-btn"
              onClick={() => deleteCategory(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </>

  );
};

export default Doctor;