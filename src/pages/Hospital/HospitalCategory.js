import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalCategory.css';
import hospital from '../../assets/hospital-img.jpg'; // Placeholder image
import { getHospitalTypes, createHospitalType, updateHospitalType, deleteHospitalType, uploadImage } from '../../api/api'; // Import API functions

export default function HospitalCategory() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]); // Categories fetched from the backend
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(''); // This will hold the final image URL
  const [editIndex, setEditIndex] = useState(null); // To keep track of the category being edited
  const [imagePreview, setImagePreview] = useState(null); // Store image preview for uploaded image

  // Fetch categories from API when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getHospitalTypes(); // Fetch from API
        setCategories(response.data.resultData); // Update state with fetched categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []); // Run only once when the component mounts

  // Handle opening the form to add a new category
  const handleAddCategory = () => {
    setEditIndex(null); // Clear edit index when adding a new category
    setIsFormOpen(true);
  };

  // Handle category input change
  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Handle file input change (image upload)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
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
        setNewCategoryImage(response.data.imageUrl); // Set the image URL returned by the backend
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Save the new category (Add or Update)
  const handleSaveCategory = async () => {
    if (newCategory.trim() && newCategoryImage) {
      const categoryData = { name: newCategory, imageUrl: newCategoryImage };
      try {
        if (editIndex !== null) {
          // If we're editing, update the existing category
          const categoryId = categories[editIndex].id;
          await updateHospitalType({ id: categoryId, ...categoryData });
        } else {
          // If we're adding, add a new category
          await createHospitalType(categoryData);
        }
        setNewCategory('');
        setNewCategoryImage('');
        setImagePreview(null); // Clear image preview
        setIsFormOpen(false);
        // Refresh categories after adding/editing
        const response = await getHospitalTypes();
        setCategories(response.data.resultData);
      } catch (error) {
        console.error('Error saving category:', error);
      }
    }
  };

  // Cancel adding or editing a category
  const handleCancelAdd = () => {
    setNewCategory('');
    setNewCategoryImage('');
    setImagePreview(null); // Clear image preview
    setIsFormOpen(false);
  };

  // Delete category
  const handleDeleteCategory = async (index) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const categoryId = categories[index].id;
      try {
        await deleteHospitalType({ id: categoryId });
        // Refresh categories after deletion
        const response = await getHospitalTypes();
        setCategories(response.data.resultData);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // Delete all categories
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all categories?')) {
      try {
        // Delete all categories (you may want to implement batch delete or delete one by one)
        await Promise.all(
          categories.map(async (category) => {
            await deleteHospitalType({ id: category.id });
          })
        );
        // Refresh categories after deletion
        const response = await getHospitalTypes();
        setCategories(response.data.resultData);
      } catch (error) {
        console.error('Error deleting all categories:', error);
      }
    }
  };

  // Edit category
  const handleEditCategory = (index) => {
    setEditIndex(index);
    setNewCategory(categories[index].name);
    setNewCategoryImage(categories[index].imageUrl);
    setImagePreview(categories[index].imageUrl); // Set preview with existing image
    setIsFormOpen(true);
  };

  // Navigate to the category details page
  const handleCategoryClick = (id) => {
    navigate(`/hospital/${id}`);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Hospital Categories</h1>
        <div>
          <button className="btn btn-add" onClick={handleAddCategory}>
            + Add Category
          </button>
          <button className="btn btn-delete-all" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      </div>

      {/* Form to Add or Edit Category */}
      {isFormOpen && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editIndex !== null ? 'Edit Category' : 'Add New Category'}</h2>
            <input
              type="text"
              value={newCategory}
              onChange={handleCategoryChange}
              placeholder="Enter category name"
            />
            {/* Image Upload */}
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field file-input"
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>
            <div className="form-actions">
              <button className="btn btn-cancel" onClick={handleCancelAdd}>
                Cancel
              </button>
              <button className="btn btn-save" onClick={handleSaveCategory}>
                {editIndex !== null ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category List */}
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index} className="category-item">
            <div
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-images">
                {/* Display the uploaded image */}
                <img
                  src={category.imageUrl || hospital} // Fallback to placeholder if no image
                  alt={category.name}
                  className="category-image"
                />
              </div>
              <div className="category-details">
                <h3>{category.name}</h3>
              </div>
            </div>
            <div className="category-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEditCategory(index)}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDeleteCategory(index)}
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
