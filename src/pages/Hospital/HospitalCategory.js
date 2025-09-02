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
import AdManagement from '../../components/AdManagement/AdManagement';

export default function HospitalCategory() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [newOrderNo, setNewOrderNo] = useState(''); // ✅ order_no state
  const [editIndex, setEditIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getHospitalTypes();
      let data = response.data.resultData || [];

      // ✅ sort categories by order_no (null at end)
      data.sort((a, b) => {
        if (a.order_no == null && b.order_no == null) return 0;
        if (a.order_no == null) return 1;
        if (b.order_no == null) return -1;
        return a.order_no - b.order_no;
      });

      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditIndex(null);
    setNewCategory('');
    setNewCategoryImage('');
    setNewOrderNo('');
    setImagePreview(null);
    setIsFormOpen(true);
  };

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleOrderChange = (e) => {
    setNewOrderNo(e.target.value);
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
      const categoryData = {
        name: newCategory,
        imageUrl: newCategoryImage,
        order_no: newOrderNo ? parseInt(newOrderNo) : null, // ✅ save order_no
      };
      try {
        if (editIndex !== null) {
          const categoryId = categories[editIndex].id;
          await updateHospitalType({ id: categoryId, ...categoryData });
        } else {
          await createHospitalType(categoryData);
        }

        setIsFormOpen(false);
        await fetchCategories(); // refresh list with sorting
      } catch (error) {
        console.error('Error saving category:', error);
      }
    }
  };

  const handleCancelAdd = () => {
    setNewCategory('');
    setNewCategoryImage('');
    setNewOrderNo('');
    setImagePreview(null);
    setIsFormOpen(false);
  };

  const handleDeleteCategory = async (index) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const categoryId = categories[index].id;
      try {
        await deleteHospitalType({ id: categoryId });
        await fetchCategories();
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
        await fetchCategories();
      } catch (error) {
        console.error('Error deleting all categories:', error);
      }
    }
  };

  const handleEditCategory = (index) => {
    const cat = categories[index];
    setEditIndex(index);
    setNewCategory(cat.name);
    setNewCategoryImage(cat.imageUrl);
    setNewOrderNo(cat.order_no || '');
    setImagePreview(cat.imageUrl);
    setIsFormOpen(true);
  };

  const handleCategoryClick = (id) => {
    navigate(`/hospital/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>
          Loading Categories...
        </p>
      </div>
    );
  }

  return (
    <>
      <AdManagement category="hospital" typeId={null} itemId={null} />
      <div className="category-page">
        <div className="category-header">
          <h1>Hospital Categories</h1>
          <button className="btn btn-add" onClick={handleAddCategory}>
            + Add Category
          </button>
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
              <input
                type="number"
                value={newOrderNo}
                onChange={handleOrderChange}
                placeholder="Enter order no"
                className="input-field"
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
                  <p>Order No: {category.order_no ?? 'null'}</p>
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
    </>
  );
}
