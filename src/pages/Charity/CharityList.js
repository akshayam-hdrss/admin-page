import React, { useState, useEffect } from 'react';
import {
  getCharities,
  getCharityById,
  createCharity,
  updateCharity,
  deleteCharity,
  uploadImage
} from '../../api/api'; // Update the path as needed

const CharityList = () => {
  const [charities, setCharities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCharity, setCurrentCharity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  useEffect(() => { fetchCharities(); }, []);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      const response = await getCharities();
      setCharities(response.data.resultData);
    } catch (err) {
      setError('Failed to fetch charities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentCharity(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getCharityById(id);
      const charity = response.data.resultData;
      setFormData({
        title: charity.title,
        description: charity.description,
        banner_image: charity.banner_image,
        youtubeLink: charity.youtubeLink,
        imageUrl: charity.imageUrl,
        gallery: charity.gallery || []
      });
      setCurrentCharity(charity);
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch charity details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this charity?')) {
      try {
        await deleteCharity(id);
        setSuccess('Charity deleted successfully');
        fetchCharities();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete charity');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      banner_image: '',
      youtubeLink: '',
      imageUrl: '',
      gallery: []
    });
    setUploadStatus({
      image: { loading: false, error: null },
      banner: { loading: false, error: null },
      gallery: { loading: false, error: null }
    });
  };

  const uploadFile = async (file, type) => {
    try {
      setUploadStatus(prev => ({ ...prev, [type]: { loading: true, error: null } }));
      const formData = new FormData();
      formData.append('image', file);
      const response = await uploadImage(formData);
      return response.data.imageUrl;
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [type]: { error: 'Upload failed. Try again.' } }));
      throw error;
    } finally {
      setUploadStatus(prev => ({ ...prev, [type]: { loading: false } }));
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
      const urls = await Promise.all(files.map(file => uploadFile(file, 'gallery')));
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...urls.filter(Boolean)]
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
      gallery: formData.gallery
    };

    try {
      setLoading(true);
      if (currentCharity) {
        await updateCharity({ id: currentCharity.id, ...payload });
        setSuccess('Charity updated successfully');
      } else {
        await createCharity(payload);
        setSuccess('Charity created successfully');
      }
      setShowModal(false);
      fetchCharities();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading ||
    uploadStatus.image.loading ||
    uploadStatus.banner.loading ||
    uploadStatus.gallery.loading;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Charity Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="d-flex justify-content-between mb-3">
        <h3>Charities List</h3>
        <button className="btn btn-primary" onClick={handleCreate}>
          Add New Charity
        </button>
      </div>

      {loading && !showModal ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {charities.map((charity, index) => (
                <tr key={charity.id}>
                  <td>{index + 1}</td>
                  <td>{charity.title}</td>
                  <td>{charity.description.substring(0, 50)}...</td>
                  <td>
                    <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(charity.id)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(charity.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{currentCharity ? 'Edit Charity' : 'Create New Charity'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Title <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">YouTube Link</label>
                      <input type="url" className="form-control" name="youtubeLink" value={formData.youtubeLink} onChange={handleChange} placeholder="https://youtube.com/example" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description <span className="text-danger">*</span></label>
                    <textarea className="form-control" rows={3} name="description" value={formData.description} onChange={handleChange} required></textarea>
                  </div>

                  {/* Main Image and Banner */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Main Image</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} disabled={uploadStatus.image.loading} />
                      {formData.imageUrl && <img src={formData.imageUrl} className="img-thumbnail mt-2" style={{ maxHeight: '150px' }} alt="Main" />}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Banner Image</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} disabled={uploadStatus.banner.loading} />
                      {formData.banner_image && <img src={formData.banner_image} className="img-thumbnail mt-2" style={{ maxHeight: '150px' }} alt="Banner" />}
                    </div>
                  </div>

                  {/* Gallery Upload */}
                  <div className="mb-3">
                    <label className="form-label">Gallery Images</label>
                    <input type="file" className="form-control" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploadStatus.gallery.loading} key={formData.gallery.length} />
                    <div className="d-flex flex-wrap mt-2">
                      {formData.gallery.map((img, i) => (
                        <div key={i} className="position-relative me-2 mb-2">
                          <img src={img} className="img-thumbnail" style={{ height: '100px', width: '100px', objectFit: 'cover' }} alt={`Gallery ${i}`} />
                          <button className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={(e) => { e.preventDefault(); removeGalleryImage(i); }} style={{ transform: 'translate(50%, -50%)' }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)} type="button">Cancel</button>
                  <button className="btn btn-primary" type="submit" disabled={isSubmitDisabled}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</> : currentCharity ? 'Update Charity' : 'Create Charity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharityList;
