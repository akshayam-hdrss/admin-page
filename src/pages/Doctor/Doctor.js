import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Doctor.css';
import { 
  getDoctorTypes, 
  createDoctorType, 
  updateDoctorType, 
  deleteDoctorType, 
  uploadImage 
} from '../../api/api.js'; 
import AdManagement from '../../components/AdManagement/AdManagement.js';

const Doctor = () => {
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', imageUrl: '', path: '', order_no: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getDoctorTypes();
      let data = response.data.resultData || [];

      // ✅ Sort by order_no (ascending, nulls last)
      data = data.sort((a, b) => {
        if (a.order_no == null && b.order_no == null) return 0;
        if (a.order_no == null) return 1;
        if (b.order_no == null) return -1;
        return a.order_no - b.order_no;
      });

      setCategories(data);
    } catch (error) {
      console.error('Error fetching doctor categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Delete
  const deleteCategory = async (index) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const categoryId = categories[index].id;
        await deleteDoctorType(categoryId);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // ✅ Image upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const response = await uploadImage(formData);
      setNewCategory((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Form submit
  const handleFormSubmit = async () => {
    try {
      let payload = {
        ...newCategory,
        order_no: newCategory.order_no === '' ? null : parseInt(newCategory.order_no),
      };

      if (editIndex !== null) {
        const categoryId = categories[editIndex].id;
        await updateDoctorType(categoryId, payload);
      } else {
        await createDoctorType(payload);
      }

      fetchCategories();
      setIsFormOpen(false);
      setNewCategory({ name: '', imageUrl: '', path: '', order_no: '' });
      setImagePreview(null);
      setEditIndex(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // ✅ Edit mode
  const openEditForm = (index) => {
    const categoryToEdit = categories[index];
    setNewCategory({
      ...categoryToEdit,
      order_no: categoryToEdit.order_no ?? '',
    });
    setImagePreview(categoryToEdit.imageUrl);
    setEditIndex(index);
    setIsFormOpen(true);
  };

  // ✅ Add new
  const openAddForm = () => {
    setNewCategory({ name: '', imageUrl: '', path: '', order_no: '' });
    setImagePreview(null);
    setEditIndex(null);
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

        {/* ✅ Form */}
        {isFormOpen && (
          <div className="add-category-form">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Category Name"
              className="input-field"
            />

            <input
              type="number"
              value={newCategory.order_no}
              onChange={(e) => setNewCategory({ ...newCategory, order_no: e.target.value })}
              placeholder="Order Number"
              className="input-field"
            />

            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field file-input"
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
              {uploading && <p className="uploading-text">Uploading image...</p>}
            </div>

            <div className="form-buttons">
              <button className="submit-btn" onClick={handleFormSubmit}>
                {editIndex !== null ? 'Update' : 'Add'}
              </button>
              <button className="cancel-btn" onClick={() => setIsFormOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* ✅ Category Grid */}
        <div className="doctor-category-grid">
          {categories.map((category, index) => (
            <div key={index} className="doctor-category">
              <Link to={`/doctor/${category.id}`} className="doctor-category-link">
                <img src={category.imageUrl} alt={category.name} className="doctor-category-img" />
                <h2>{category.name}</h2>
              </Link>
              <p>Order No: {category.order_no ?? 'null'}</p>
              <button className="doctor-edit-btn" onClick={() => openEditForm(index)}>Edit</button>
              <button className="doctor-delete-btn" onClick={() => deleteCategory(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Doctor;