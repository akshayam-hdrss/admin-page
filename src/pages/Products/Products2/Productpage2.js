import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  uploadImage,
  getProductTypesByAvailableProduct,
  createProductType,
  updateProductType,
  deleteProductType
} from "../../../api/api"; // ensure you add these functions to your api.js
import "../Products1/ProductPage1.css";
import AdManagement from "../../../components/AdManagement/AdManagement";

function Productpage2() {
  const { productTypeId, productId } = useParams();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await getProductTypesByAvailableProduct(productId);
      setTypes(res.data.resultData || []);
    } catch {
      alert("Failed to load product types");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadImage(formData);
      setForm((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, availableProductId: productId };
    try {
      if (isEditing) {
        await updateProductType({ id: editId, ...payload });
      } else {
        await createProductType(payload);
      }
      resetForm();
      fetchTypes();
    } catch {
      alert("Failed to save");
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, imageUrl: item.imageUrl });
    setImagePreview(item.imageUrl);
    setEditId(item.id);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product type?")) return;
    try {
      await deleteProductType(id);
      fetchTypes();
    } catch {
      alert("Failed to delete");
    }
  };

  const resetForm = () => {
    setForm({ name: "", imageUrl: "" });
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(false);
  };

  const handleCategoryClick = (id) => {
    navigate(`/product/${productTypeId}/${productId}/${id}`);
  };

  return (
  <>
  <AdManagement category="products" typeId={null} itemId={null} />
  
    <div className="product-page">
      <div className="product-header">
        <h2>Product Types</h2>
        <button className="product-btn-add" onClick={() => setIsFormOpen(true)}>
          + Add Product Type
        </button>
      </div>

      {isFormOpen && (
        <div className="product-form-overlay">
          <div className="product-form-container">
            <h2>{isEditing ? "Edit Product Type" : "Add New Product Type"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter product type name"
                required
              />
              <div className="product-image-upload">
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              {uploading && <p>Uploading image...</p>}
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
              <div className="product-form-actions">
                <button
                  type="button"
                  className="product-btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="product-btn-save">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="product-list">
        {types.map((type) => (
          <li className="product-item" key={type.id}>
            <div className="product-card" onClick={() => handleCategoryClick(type.id)}>
              {type.imageUrl && (
                <div className="product-images">
                  <img
                    src={type.imageUrl}
                    alt={type.name}
                    className="product-image"
                  />
                </div>
              )}
              <div className="product-details">
                <h3>{type.name}</h3>
              </div>
            </div>
            <div className="product-actions">
              <button className="product-btn-edit" onClick={() => handleEdit(type)}>
                Edit
              </button>
              <button className="product-btn-delete" onClick={() => handleDelete(type.id)}>
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

export default Productpage2;
