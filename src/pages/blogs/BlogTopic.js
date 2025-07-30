import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Blogs.css';
import { 
  getBlogTopics, 
  createBlogTopic, 
  deleteBlogTopic, 
  updateBlogTopic, 
  uploadImage 
} from '../../api/api';

const FALLBACK_IMAGE = process.env.REACT_APP_FALLBACK_IMAGE || 'https://via.placeholder.com/300';

export default function BlogTopics() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    bannerImage: '',
    videoUrl: '',
    author: '',
    category: 'Tech',
    status: 'Draft',
    gallery: [],
    publishDate: new Date().toISOString().split('T')[0],
    blogtopicsID: ''
  });

  const categories = ['Tech', 'Health', 'Business', 'Lifestyle', 'Education'];
  const statuses = ['Draft', 'Published', 'Archived'];

  const ensureAbsoluteUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${process.env.REACT_APP_API_BASE_URL}${url}`;
    return `${process.env.REACT_APP_API_BASE_URL}/${url}`;
  };

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBlogTopics();
      if (response.data?.result === 'Success') {
        const processedTopics = response.data.resultData.map(topic => ({
          ...topic,
          bannerImage: ensureAbsoluteUrl(topic.bannerImage),
          gallery: topic.gallery?.map(img => ensureAbsoluteUrl(img)) || []
        }));
        setTopics(processedTopics);
        setError('');
      } else {
        setError('Failed to load topics.');
      }
    } catch (err) {
      setError('Network error while fetching topics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleImageError = (blogId) => (e) => {
    e.target.src = FALLBACK_IMAGE;
    setImageLoadErrors(prev => ({ ...prev, [blogId]: true }));
    setLoadedImages(prev => ({ ...prev, [blogId]: false }));
  };

  const handleImageLoad = (blogId) => {
    setImageLoadErrors(prev => ({ ...prev, [blogId]: false }));
    setLoadedImages(prev => ({ ...prev, [blogId]: true }));
  };

  const handleImageUpload = async (e, fieldName) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadFn = fieldName === 'gallery' ? setGalleryUploading : setImageUploading;
    uploadFn(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const data = new FormData();
        data.append('image', file);
        const res = await uploadImage(data);
        return res.data?.imageUrl || "";
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(url => url).map(url => ensureAbsoluteUrl(url));

      if (validUrls.length > 0) {
        if (fieldName === 'gallery') {
          setFormData(prev => ({ 
            ...prev, 
            gallery: [...prev.gallery, ...validUrls] 
          }));
        } else {
          setFormData(prev => ({ ...prev, [fieldName]: validUrls[0] }));
        }
      } else {
        setError('Image upload failed.');
      }
    } catch (err) {
      setError('Network error while uploading image.');
    } finally {
      uploadFn(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (topic = null) => {
    if (topic) {
      setFormData({
        ...topic,
        publishDate: topic.publishDate ? topic.publishDate.split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setIsEditMode(true);
      setEditingId(topic.id);
    } else {
      setFormData({
        title: '',
        content: '',
        bannerImage: '',
        videoUrl: '',
        author: '',
        category: 'Tech',
        status: 'Draft',
        gallery: [],
        publishDate: new Date().toISOString().split('T')[0],
        blogtopicsID: ''
      });
      setIsEditMode(false);
      setEditingId(null);
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const payload = {
        ...formData,
        publishDate: new Date(formData.publishDate).toISOString()
      };

      if (isEditMode && editingId) {
        await updateBlogTopic(editingId, payload);
        setSuccess('Blog updated successfully!');
      } else {
        await createBlogTopic(payload);
        setSuccess('Blog created successfully!');
      }
      document.getElementById('closeModalBtn').click();
      fetchTopics();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit blog. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlogTopic(id);
        setSuccess('Blog deleted successfully!');
        fetchTopics();
      } catch (err) {
        setError('Failed to delete blog.');
      }
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="hospital-blogs-container container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Blog Management</h1>
          <p className="text-muted">Manage your blog posts and content.</p>
        </div>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#blogModal"
          onClick={() => handleOpenModal(null)}
        >
          + Add Blog Post
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : topics.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <h5>No blog posts found</h5>
            <p>Click the "Add Blog Post" button to create your first blog post.</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {topics.map((blog) => {
            const imageUrl = imageLoadErrors[blog.id] 
              ? FALLBACK_IMAGE 
              : (blog.bannerImage || FALLBACK_IMAGE);
            
            return (
              <div key={blog.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow" onClick={() => navigate(`/blog/${blog.id}`)}>
                  <div className="position-relative" style={{ height: '200px' }}>
                    {!loadedImages[blog.id] && !imageLoadErrors[blog.id] && (
                      <div className="img-loading"></div>
                    )}
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className={`card-img-top cursor-pointer ${loadedImages[blog.id] ? 'img-loaded' : 'img-hidden'}`}
                      style={{ 
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover'
                      }}
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      onError={handleImageError(blog.id)}
                      onLoad={() => handleImageLoad(blog.id)}
                      loading="lazy"
                    />
                    {imageLoadErrors[blog.id] && (
                      <div className="img-fallback d-flex align-items-center justify-content-center">
                        <span>Image not available</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title">{blog.title}</h5>
                      <span className={`badge ${blog.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}>
                        {blog.status}
                      </span>
                    </div>
                    <p className="card-text text-muted small mb-1">By {blog.author}</p>
                    <p className="card-text text-muted small mb-2">Category: {blog.category}</p>
                    <p className="card-text text-truncate">{blog.content}</p>
                  </div>
                  <div className="card-footer bg-transparent d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#blogModal"
                      onClick={() => handleOpenModal(blog)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blog Modal */}
      <div className="modal fade" id="blogModal" tabIndex="-1" aria-labelledby="blogModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <form onSubmit={handleSubmit} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="blogModalLabel">
                {isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h5>
              <button
                type="button"
                className="btn-close"
                id="closeModalBtn"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Author*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category*</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status*</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Publish Date*</label>
                  <input
                    type="date"
                    className="form-control"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Blog Topic ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="blogtopicsID"
                    value={formData.blogtopicsID}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => handleImageUpload(e, 'bannerImage')}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <div className="mt-2 text-info">
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading image...
                    </div>
                  )}
                  {formData.bannerImage && (
                    <img
                      src={formData.bannerImage}
                      alt="Banner Preview"
                      className="mt-2 rounded"
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                        e.target.className = 'mt-2 rounded img-fallback';
                      }}
                    />
                  )}
                </div>
                <div className="col-md-12">
                  <label className="form-label">Video URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Content*</label>
                  <textarea
                    className="form-control"
                    name="content"
                    rows="5"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label">Gallery Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    disabled={galleryUploading}
                    multiple
                  />
                  {galleryUploading && (
                    <div className="mt-2 text-info">
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading images...
                    </div>
                  )}
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {formData.gallery.map((img, index) => (
                      <div key={index} className="position-relative" style={{ width: '100px' }}>
                        <img
                          src={img}
                          alt={`Gallery ${index}`}
                          className="rounded"
                          style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = FALLBACK_IMAGE;
                            e.target.className = 'rounded img-fallback';
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => removeGalleryImage(index)}
                          style={{ transform: 'translate(50%, -50%)' }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={submitting || imageUploading || galleryUploading}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}