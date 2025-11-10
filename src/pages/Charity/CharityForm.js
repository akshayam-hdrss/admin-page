import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../api/api';

const CharityForm = ({ charity, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner_image: '',
    youtubeLink: '',
    imageUrl: '',
    gallery: []
  });

  const [uploadStatus, setUploadStatus] = useState({
    image: { loading: false, error: null },
    banner: { loading: false, error: null },
    gallery: { loading: false, error: null }
  });

  useEffect(() => {
    if (charity) {
      setFormData({
        title: charity.title,
        description: charity.description,
        banner_image: charity.banner_image,
        youtubeLink: charity.youtubeLink,
        imageUrl: charity.imageUrl,
        gallery: charity.gallery || []
      });
    }
  }, [charity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file, type) => {
    try {
      setUploadStatus(prev => ({ ...prev, [type]: { ...prev[type], loading: true, error: null } }));
      const formData = new FormData();
      formData.append('image', file);
      const response = await uploadImage(formData);
      return response.data.url;
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [type]: { ...prev[type], error: 'Upload failed. Please try again.' } }));
      throw error;
    } finally {
      setUploadStatus(prev => ({ ...prev, [type]: { ...prev[type], loading: false } }));
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, type);
      setFormData(prev => ({ 
        ...prev, 
        [type === 'image' ? 'imageUrl' : 'banner_image']: url 
      }));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploadStatus(prev => ({ ...prev, gallery: { loading: true, error: null } }));
      
      const uploadPromises = files.map(file => uploadFile(file, 'gallery'));
      const urls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...urls.filter(url => url)]
      }));
    } catch (error) {
      console.error('Gallery upload error:', error);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Please fill all required fields');
      return;
    }

    if (uploadStatus.image.loading || uploadStatus.banner.loading || uploadStatus.gallery.loading) {
      alert('Please wait for all uploads to finish');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      ...(formData.youtubeLink && { youtubeLink: formData.youtubeLink }),
      ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
      ...(formData.banner_image && { banner_image: formData.banner_image }),
      gallery: formData.gallery.filter(item => item)
    };

    onSubmit(payload);
  };

  const isSubmitDisabled = loading || 
    uploadStatus.image.loading || 
    uploadStatus.banner.loading || 
    uploadStatus.gallery.loading;

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Title <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">YouTube Link</label>
          <input
            type="url"
            className="form-control"
            name="youtubeLink"
            value={formData.youtubeLink}
            onChange={handleChange}
            placeholder="https://youtube.com/example"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description <span className="text-danger">*</span></label>
        <textarea
          className="form-control"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Main Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'image')}
            disabled={uploadStatus.image.loading}
          />
          {formData.imageUrl && (
            <div className="mt-2 position-relative">
              <img 
                src={formData.imageUrl} 
                className="img-thumbnail" 
                style={{ maxHeight: '150px' }} 
                alt="Main" 
              />
              {uploadStatus.image.loading && (
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {uploadStatus.image.error && (
            <div className="text-danger mt-1">{uploadStatus.image.error}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Banner Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'banner')}
            disabled={uploadStatus.banner.loading}
          />
          {formData.banner_image && (
            <div className="mt-2 position-relative">
              <img 
                src={formData.banner_image} 
                className="img-thumbnail" 
                style={{ maxHeight: '150px' }} 
                alt="Banner" 
              />
              {uploadStatus.banner.loading && (
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {uploadStatus.banner.error && (
            <div className="text-danger mt-1">{uploadStatus.banner.error}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Gallery Images</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          disabled={uploadStatus.gallery.loading}
          key={formData.gallery.length}
        />
        <div className="d-flex flex-wrap mt-2">
          {formData.gallery.map((img, index) => (
            img && (
              <div key={index} className="position-relative me-2 mb-2">
                <img 
                  src={img} 
                  className="img-thumbnail" 
                  style={{ height: '100px', width: '100px', objectFit: 'cover' }} 
                  alt={`Gallery ${index}`}
                />
                <button
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  onClick={(e) => {
                    e.preventDefault();
                    removeGalleryImage(index);
                  }}
                  style={{ transform: 'translate(50%, -50%)' }}
                >
                  ×
                </button>
              </div>
            )
          ))}
          {uploadStatus.gallery.loading && (
            <div className="d-flex align-items-center ms-2">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <small>Uploading gallery images...</small>
            </div>
          )}
          {uploadStatus.gallery.error && (
            <div className="text-danger ms-2">{uploadStatus.gallery.error}</div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button 
          className="btn btn-primary" 
          type="submit" 
          disabled={isSubmitDisabled}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Saving...
            </>
          ) : charity ? (
            'Update Charity'
          ) : (
            'Create Charity'
          )}
        </button>
      </div>
    </form>
  );
};

export default CharityForm;