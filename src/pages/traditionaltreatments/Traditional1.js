import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Hospital/HospitalCategory.css';
import hospital from '../../assets/hospital-img.jpg';
import {
  deleteTraditionalType,
  getTraditionalType,
  updateTraditionalType,
  createTraditionalType,
  uploadImage,
} from '../../api/api';
import AdManagement from '../../components/AdManagement/AdManagement';

export default function Traditional1() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [newCategoryOrder, setNewCategoryOrder] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Fetch & sort categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getTraditionalType();
      let fetchedCategories = response.data.resultData;

     
      fetchedCategories.sort((a, b) => {
      const aOrder = a.order_no ? String(a.order_no) : Infinity;
      const bOrder = b.order_no ? String(b.order_no) : Infinity;
      return aOrder - bOrder;
});

      setCategories(fetchedCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    } 
  };

  // ✅ Open Add Form
  const handleAddCategory = () => {
    setEditIndex(null);
    setNewCategory('');
    setNewCategoryImage('');
    setNewCategoryOrder('');
    setImagePreview(null);
    setIsFormOpen(true);
  };

  // ✅ Input Handlers
  const handleCategoryChange = (e) => setNewCategory(e.target.value);
  const handleOrderChange = (e) => setNewCategoryOrder(e.target.value);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      // Upload to backend
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

  // ✅ Save New / Edited Category
  const handleSaveCategory = async () => {
    if (newCategory.trim() && newCategoryImage) {
      const categoryData = {
  name: newCategory,
  imageUrl: newCategoryImage,
  order_no: newCategoryOrder !== '' ? Number(newCategoryOrder) : null,
};

      try {
        if (editIndex !== null) {
          const categoryId = categories[editIndex].id;
          console.log("Updating category with:", { id: categoryId, ...categoryData });
          await updateTraditionalType({ id: categoryId, ...categoryData });
        } else {
          await createTraditionalType(categoryData);
        }

        resetForm();
        await fetchCategories();
      } catch (error) {
        console.error('Error saving category:', error);
      }
    }
  };

  const handleCancelAdd = () => resetForm();

  // ✅ Reset Form
  const resetForm = () => {
    setNewCategory('');
    setNewCategoryImage('');
    setNewCategoryOrder('');
    setImagePreview(null);
    setIsFormOpen(false);
    setEditIndex(null);
  };

  // ✅ Delete Category
  const handleDeleteCategory = async (index) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const categoryId = categories[index].id;
      try {
        await deleteTraditionalType({ id: categoryId });
        await fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // ✅ Edit Category
  const handleEditCategory = (index) => {
    setEditIndex(index);
    setNewCategory(categories[index].name);
    setNewCategoryImage(categories[index].imageUrl);
    setNewCategoryOrder(categories[index].order_no ?? '');
    setImagePreview(categories[index].imageUrl);
    setIsFormOpen(true);
  };

  const handleCategoryClick = (id) => navigate(`/traditional/${id}`);

  // ✅ Loading UI
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
      <AdManagement category="traditional" typeId={null} itemId={null} />
      <div className="category-page">
        <div className="category-header">
          <h1>Traditional Categories</h1>
          <button className="btn btn-add" onClick={handleAddCategory}>
            + Add Category
          </button>
        </div>

        {/* ✅ Form Modal */}
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
                value={newCategoryOrder}
                onChange={handleOrderChange}
                placeholder="Enter order number"
              />
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field file-input"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
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

        {/* ✅ Category List */}
        <ul className="category-list">
          {categories.map((category, index) => (
            <li key={category.id} className="category-item">
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
