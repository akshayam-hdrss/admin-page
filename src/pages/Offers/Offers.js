


import React, { useState, useEffect } from 'react';
import { 
  createOffer, 
  getOffers, 
  updateOffer, 
  deleteOffer, 
  uploadImage
} from '../../api/api';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    galleryFiles: [],
    existingImages: [],
    editId: null
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOffers();
      if (response.data?.result === 'Success') {
        setOffers(response.data.resultData);
      } else {
        setError(response.data?.message || 'Failed to fetch offers');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching offers');
      console.error('Fetch offers error:', err);
    } finally {
      setLoading(false);
    }
  };

 const uploadImages = async (files) => {
  const uploadedUrls = [];
  
  for (const file of files) {
    try {
      // Create FormData and append the file with 'image' key
      const formData = new FormData();
      formData.append('image', file);  // This matches what your backend expects

      const response = await uploadImage(formData);  // Now passing FormData
      const imageUrl = response.data?.imageUrl || response.data?.url;
      
      if (imageUrl) {
        uploadedUrls.push(imageUrl);
      } else {
        throw new Error('Server did not return image URL');
      }
    } catch (err) {
      console.error('Error uploading image:', {
        error: err,
        response: err.response?.data
      });
      throw new Error('Failed to upload images');
    }
  }

  return uploadedUrls;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name.trim()) {
      setError('Please enter an offer name');
      return;
    }

    try {
      setLoading(true);
      
      const newImages = formData.galleryFiles.length > 0 
        ? await uploadImages(formData.galleryFiles) 
        : [];

      const finalGallery = [...formData.existingImages, ...newImages];
      
      if (finalGallery.length === 0) {
        setError('Please add at least one image');
        return;
      }

      const payload = { 
        name: formData.name, 
        gallery: finalGallery 
      };

      if (formData.editId) {
        await updateOffer(formData.editId, payload);
      } else {
        await createOffer(payload);
      }

      resetForm();
      await fetchOffers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setFormData({
      name: offer.name,
      galleryFiles: [],
      existingImages: offer.gallery || [],
      editId: offer._id || offer.id
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        setLoading(true);
        await deleteOffer(id);
        await fetchOffers();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete offer');
        console.error('Delete error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      galleryFiles: [],
      existingImages: [],
      editId: null
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h2>Exclusive Offers</h2>

      {loading && <div style={{ padding: '10px', background: '#f0f0f0' }}>Loading...</div>}
      {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <h3>{formData.editId ? 'Edit Offer' : 'Add New Offer'}</h3>
        
        <input
          type="text"
          placeholder="Offer name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <div style={{ marginBottom: '10px' }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFormData(prev => ({
              ...prev, 
              galleryFiles: Array.from(e.target.files)
            }))}
          />
          {formData.galleryFiles.length > 0 && (
            <p>{formData.galleryFiles.length} new image(s) selected</p>
          )}
        </div>

        {(formData.existingImages.length > 0 || formData.galleryFiles.length > 0) && (
          <div style={{ marginBottom: '10px' }}>
            <p>Preview:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {formData.existingImages.map((img, index) => (
                <div key={`existing-${index}`} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt="Gallery"
                    style={{
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  />
                  {formData.editId && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              
              {formData.galleryFiles.map((file, index) => (
                <div key={`new-${index}`} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="New gallery"
                    style={{
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            background: formData.editId ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {formData.editId ? 'Update Offer' : 'Add Offer'}
        </button>

        {formData.editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ 
              padding: '10px 20px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h3>Current Offers ({offers.length})</h3>
      {offers.length === 0 ? (
        <p>No offers available</p>
      ) : (
        offers.map((offer) => (
          <div
            key={offer._id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '8px',
              background: '#f9f9f9'
            }}
          >
            <h4 style={{ marginTop: 0 }}>{offer.name}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
              {(offer.gallery || []).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Offer"
                  style={{
                    width: '120px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleEdit(offer)}
                style={{
                  padding: '8px 16px',
                  background: '#FFC107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(offer._id || offer.id)}
                style={{
                  padding: '8px 16px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OffersPage;