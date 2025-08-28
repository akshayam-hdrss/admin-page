
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Blogs.css';
import { 
  getBlogs, 
  createBlog, 
  deleteBlog, 
  updateBlog, 
  uploadImage 
} from '../../api/api';

const FALLBACK_IMAGE = process.env.REACT_APP_FALLBACK_IMAGE || 'https://via.placeholder.com/300';

export default function BlogManagement() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
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
  const {id} = useParams();
  console.log("id", id);

  const categories = ['Tech', 'Health', 'Business', 'Lifestyle', 'Education', 'Programming'];
  const statuses = ['Draft', 'Published', 'Archived'];

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    bannerImage: '',
    imageUrl: '',
    videoUrl: '',
    author: '',
    category: 'Tech',
    status: 'Draft',
    gallery: [],
    publishDate: new Date().toISOString().split('T')[0], // Initialize with YYYY-MM-DD format
    blogtopicsID: ''
  });

  const ensureAbsoluteUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${process.env.REACT_APP_API_BASE_URL}${url}`;
    return `${process.env.REACT_APP_API_BASE_URL}/${url}`;
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBlogs(id);
      if (response.data?.result === 'Success') {
        const processedBlogs = response.data.resultData.map(blog => ({
          ...blog,
          bannerImage: ensureAbsoluteUrl(blog.bannerImage),
          gallery: blog.gallery?.map(img => ensureAbsoluteUrl(img)) || [],
          publishDate: blog.publishDate ? blog.publishDate.split('T')[0] : '' // Ensure YYYY-MM-DD format
        }));
        setBlogs(processedBlogs);
        setError('');
      } else {
        setError(response.data?.message || 'Failed to load blogs.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error while fetching blogs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

  // Decide which loading state to update
  const uploadFn = fieldName === 'gallery' ? setGalleryUploading : setImageUploading;
  uploadFn(true);

  try {
    const uploadPromises = Array.from(files).map(async (file) => {
      if (!file.type.match('image.*')) {
        throw new Error('Only image files are allowed');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      const data = new FormData();
      data.append('image', file);
      const res = await uploadImage(data);
      return res.data?.imageUrl || "";
    });

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(url => url).map(url => ensureAbsoluteUrl(url));

    if (validUrls.length > 0) {
      if (fieldName === 'gallery') {
        // multiple images
        setFormData(prev => ({ 
          ...prev, 
          gallery: [...prev.gallery, ...validUrls] 
        }));
      } else if (fieldName === 'bannerImage' || fieldName === 'imageUrl') {
        // single image (banner or imageUrl)
        setFormData(prev => ({ ...prev, [fieldName]: validUrls[0] }));
      }
    } else {
      setError('Image upload failed - no valid URLs returned');
    }
  } catch (err) {
    setError(err.message || 'Failed to upload image');
  } finally {
    uploadFn(false);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setFormData({
        ...blog,
        publishDate: blog.publishDate ? blog.publishDate.split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setIsEditMode(true);
      setEditingId(blog.id);
    } else {
      setFormData({
        title: '',
        content: '',
        bannerImage: '',
        videoUrl: '',
        imageUrl: '',
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
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    if (!formData.publishDate) {
      setError('Publish date is required');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Format date as YYYY-MM-DD for MySQL compatibility
      const publishDate = new Date(formData.publishDate);
      const formattedDate = publishDate.toISOString().split('T')[0];

      const payload = {
        ...formData,
        publishDate: formattedDate
      };

      if (isEditMode && editingId) {
        await updateBlog(editingId, payload);
        setSuccess('Blog updated successfully!');
      } else {
        await createBlog(payload);
        setSuccess('Blog created successfully!');
      }
      document.getElementById('closeModalBtn').click();
      await fetchBlogs();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit blog. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      try {
        await deleteBlog(id);
        setSuccess('Blog deleted successfully!');
        await fetchBlogs();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete blog.');
      }
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="blog-management-container container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Blog Management</h1>
          <p className="text-muted">Create and manage your blog content</p>
        </div>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#blogModal"
          onClick={() => handleOpenModal(null)}
        >
          <i className="bi bi-plus-lg me-2"></i>Add New Blog
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-journal-text display-5 text-muted mb-3"></i>
            <h5>No blogs found</h5>
            <p className="text-muted">Get started by creating your first blog post</p>
            <button
              className="btn btn-primary mt-3"
              data-bs-toggle="modal"
              data-bs-target="#blogModal"
              onClick={() => handleOpenModal(null)}
            >
              Create Blog Post
            </button>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {blogs.map((blog) => {
            const imageUrl = imageLoadErrors[blog.id] 
              ? FALLBACK_IMAGE 
              : (blog.bannerImage || FALLBACK_IMAGE);
            
            return (
              <div key={blog.id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    {!loadedImages[blog.id] && !imageLoadErrors[blog.id] && (
                      <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        <div className="spinner-border text-secondary" role="status"></div>
                      </div>
                    )}
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className={`img-fluid w-100 h-100 object-fit-cover ${loadedImages[blog.id] ? '' : 'invisible'}`}
                      style={{ transition: 'opacity 0.3s' }}
                      onError={handleImageError(blog.id)}
                      onLoad={() => handleImageLoad(blog.id)}
                      loading="lazy"
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className={`badge ${blog.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}>
                        {blog.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text text-muted small mb-2">
                      <i className="bi bi-person-fill me-1"></i> {blog.author || 'Unknown'}
                    </p>
                    <p className="card-text text-muted small mb-2">
                      <i className="bi bi-tag-fill me-1"></i> {blog.category}
                    </p>
                    <p className="card-text text-muted small">
                      <i className="bi bi-calendar me-1"></i> {formatDate(blog.publishDate)}
                    </p>
                    <p className="card-text mt-3">
                      {blog.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                    </p>
                  </div>
                  <div className="card-footer bg-transparent d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#blogModal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(blog);
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(blog.id);
                      }}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="modal fade" id="blogModal" tabIndex="-1" aria-labelledby="blogModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <form onSubmit={handleSubmit} className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title" id="blogModalLabel">
                {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                <div className="col-12">
  <label className="form-label">Image URL</label>

  {/* Manual entry */}
  {/* <input
    type="url"
    className="form-control mb-2"
    name="imageUrl"
    value={formData.imageUrl}
    onChange={handleInputChange}
    placeholder="https://example.com/image.jpg"
  /> */}

  {/* File upload option */}
  <input
    type="file"
    accept="image/*"
    className="form-control"
    onChange={(e) => handleImageUpload(e, 'imageUrl')}
    disabled={imageUploading}
  />
  {imageUploading && (
    <div className="mt-2 text-primary">
      <div className="spinner-border spinner-border-sm me-2"></div>
      Uploading image...
    </div>
  )}

  {/* Preview if set */}
  {formData.imageUrl && (
    <div className="mt-3">
      <img
        src={formData.imageUrl}
        alt="Image URL Preview"
        className="img-fluid rounded border"
        style={{ maxHeight: '200px' }}
        onError={(e) => {
          e.target.src = FALLBACK_IMAGE;
          e.target.className = 'img-fluid rounded border img-fallback';
        }}
      />
      <button
        type="button"
        className="btn btn-sm btn-danger mt-2"
        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
      >
        Remove Image
      </button>
    </div>
  )}
</div>

                <div className="col-12">
                  <label className="form-label">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => handleImageUpload(e, 'bannerImage')}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <div className="mt-2 text-primary">
                      <div className="spinner-border spinner-border-sm me-2"></div>
                      Uploading image...
                    </div>
                  )}
                  {formData.bannerImage && (
                    <div className="mt-3">
                      <img
                        src={formData.bannerImage}
                        alt="Banner Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: '200px' }}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                          e.target.className = 'img-fluid rounded border img-fallback';
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => setFormData(prev => ({ ...prev, bannerImage: '' }))}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-12">
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
                    rows={8}
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
                    <div className="mt-2 text-primary">
                      <div className="spinner-border spinner-border-sm me-2"></div>
                      Uploading images...
                    </div>
                  )}
                  {formData.gallery.length > 0 && (
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      {formData.gallery.map((img, index) => (
                        <div key={index} className="position-relative" style={{ width: '120px' }}>
                          <img
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="img-fluid rounded border"
                            style={{ height: '100px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = FALLBACK_IMAGE;
                              e.target.className = 'img-fluid rounded border img-fallback';
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => removeGalleryImage(index)}
                            style={{ padding: '0.15rem 0.3rem' }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submitting || imageUploading || galleryUploading}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditMode ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                    {isEditMode ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}