import React, { useEffect, useState } from "react";
import {
  uploadImage,
  createPrimecareIcon,
  getPrimecareIcons,
  updatePrimecareIcon,
  deletePrimecareIcon,
} from "../../api/api";

export default function PrimecareIcon() {
  const [icons, setIcons] = useState([]);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all icons
  const fetchIcons = async () => {
    setLoading(true);
    try {
      const res = await getPrimecareIcons();
      setIcons(res.data);
    } catch (err) {
      alert("Failed to fetch icons.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image first.");
    const data = new FormData();
    data.append("image", file);
    setLoading(true);
    try {
      const res = await uploadImage(data);
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      alert("Image upload failed.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return alert("Name and image required.");
    setLoading(true);
    try {
      if (editingId) {
        await updatePrimecareIcon(editingId, formData);
      } else {
        await createPrimecareIcon(formData);
      }
      fetchIcons();
      setFormData({ name: "", image: "" });
      setFile(null);
      setEditingId(null);
    } catch (err) {
      alert("Save failed.");
    }
    setLoading(false);
  };

  const handleEdit = (icon) => {
    setFormData({ name: icon.name, image: icon.image });
    setEditingId(icon.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    setLoading(true);
    try {
      await deletePrimecareIcon(id);
      fetchIcons();
    } catch {
      alert("Delete failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Manage Primecare Icons</h3>

      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="border p-3 rounded mb-4">
        <div className="mb-3">
          <label className="form-label">Icon Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            className="form-control"
            onChange={handleChange}
            placeholder="e.g., Heart Care"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
          <button type="button" className="btn btn-secondary mt-2" onClick={handleUpload}>
            Upload
          </button>
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="preview" height="60" />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-warning ms-2"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", image: "" });
              setFile(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Image</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {icons.map((icon, idx) => (
            <tr key={icon.id}>
              <td>{idx + 1}</td>
              <td>{icon.name}</td>
              <td>
                <img src={icon.image} alt={icon.name} height="40" />
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleEdit(icon)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(icon.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {icons.length === 0 && !loading && (
            <tr>
              <td colSpan="4" className="text-center">
                No icons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
