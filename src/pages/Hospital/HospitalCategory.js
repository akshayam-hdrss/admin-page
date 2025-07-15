import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalCategory.css';
import hospital from '../../assets/hospital-img.jpg';
import {
  getHospitalTypes,
  createHospitalType,
  updateHospitalType,
  deleteHospitalType,
  uploadImage,
} from '../../api/api';

export default function HospitalCategory() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getHospitalTypes();
        setCategories(response.data.resultData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setEditIndex(null);
    setIsFormOpen(true);
  };

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await uploadImage(formData);
        setNewCategoryImage(response.data.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSaveCategory = async () => {
    if (newCategory.trim() && newCategoryImage) {
      const categoryData = { name: newCategory, imageUrl: newCategoryImage };
      try {
        if (editIndex !== null) {
          const categoryId = categories[editIndex].id;
          await updateHospitalType({ id: categoryId, ...categoryData });
        } else {
          await createHospitalType(categoryData);
        }

        setNewCategory('');
        setNewCategoryImage('');
        setImagePreview(null);
        setIsFormOpen(false);

        const response = await getHospitalTypes();
        setCategories(response.data.resultData);
      } catch (error) {
        console.error('Error saving category:', error);
      }
    }
  };

  const handleCancelAdd = () => {
    setNewCategory('');
    setNewCategoryImage('');
    setImagePreview(null);
    setIsFormOpen(false);
  };

  const handleDeleteCategory = async (index) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const categoryId = categories[index].id;
      try {
        await deleteHospitalType({ id: categoryId });
        const response = await getHospitalTypes();
        setCategories(response.data.resultData);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all categories?')) {
      try {
        await Promise.all(
          categories.map(async (category) => {
            await deleteHospitalType({ id: category.id });
          })
        );
        const response = await getHospitalTypes();
        setCategories(response.data.resultData);
      } catch (error) {
        console.error('Error deleting all categories:', error);
      }
    }
  };

  const handleEditCategory = (index) => {
    setEditIndex(index);
    setNewCategory(categories[index].name);
    setNewCategoryImage(categories[index].imageUrl);
    setImagePreview(categories[index].imageUrl);
    setIsFormOpen(true);
  };

  const handleCategoryClick = (id) => {
    navigate(`/hospital/${id}`);
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
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field file-input"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              )}
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

      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index} className="category-item">
            <div
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-images">
                <img
                  src={category.imageUrl || hospital}
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
