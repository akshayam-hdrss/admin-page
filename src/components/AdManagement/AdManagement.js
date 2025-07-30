import React, { useEffect, useState } from "react";
import { getAds, createAd, updateAd, uploadImage } from "../../api/api";

export default function AdManagement({ category = "default", typeId = null, itemId = null }) {
  const [ads, setAds] = useState([]);
  const [formData, setFormData] = useState({
    imageUrl: [],
    youtubeLinks: [],
  });
  const [youtubeLinkInput, setYoutubeLinkInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [category, typeId, itemId]);

  const fetchAds = async () => {
    try {
      const res = await getAds(category, typeId, itemId);
      setMessage(res.data.message || "");
      
      // Normalize the ads data to ensure imageUrl and youtubeLinks are always arrays
      const normalizedAds = (res.data.resultData || []).map(ad => ({
        ...ad,
        imageUrl: Array.isArray(ad.imageUrl) ? ad.imageUrl : [],
        youtubeLinks: Array.isArray(ad.youtubeLinks) ? ad.youtubeLinks : []
      }));
      
      setAds(normalizedAds);
    } catch (error) {
      console.error("Error fetching ads:", error);
      setMessage("Failed to load ads");
      setAds([]);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);
        const res = await uploadImage(formDataUpload);
        return res.data?.imageUrl;
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url);
      
      setFormData(prev => ({
        ...prev,
        imageUrl: [...prev.imageUrl, ...uploadedUrls]
      }));
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddYoutubeLink = () => {
    if (!youtubeLinkInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      youtubeLinks: [...prev.youtubeLinks, youtubeLinkInput.trim()],
    }));
    setYoutubeLinkInput("");
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveYoutubeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.imageUrl.length === 0 && formData.youtubeLinks.length === 0) {
      alert("Please add at least one image or YouTube link");
      return;
    }

    const payload = {
      imageUrl: formData.imageUrl,
      youtubeLinks: formData.youtubeLinks,
      typeId,
      itemId,
      category,
    };

    try {
      if (isEditing && editingId) {
        await updateAd(editingId, payload);
      } else {
        await createAd(payload);
      }

      resetForm();
      fetchAds();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save ad. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: [],
      youtubeLinks: [],
    });
    setYoutubeLinkInput("");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (ad) => {
    setFormData({
      imageUrl: Array.isArray(ad.imageUrl) ? ad.imageUrl : [],
      youtubeLinks: Array.isArray(ad.youtubeLinks) ? ad.youtubeLinks : [],
    });
    setIsEditing(true);
    setEditingId(ad.id);
  };

  const normalizeYoutubeLink = (link) => {
    if (!link) return "";
    try {
      const url = new URL(link);
      return url.href;
    } catch {
      return link;
    }
  };

  return (
    <div className="ad-management-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="ad-management-title">Ads Management</h1>
      <h3>Category: {category} {typeId && `| Type ID: ${typeId}`} {itemId && `| Item ID: ${itemId}`}</h3>

      {(message === "No table found" || isEditing || ads.length === 0) && (
        <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
          <h2 style={{ marginBottom: "20px" }}>{isEditing ? "Edit Ad" : "Add New Ad"}</h2>
          <form onSubmit={handleSubmit} className="ad-form">
            <div style={{ marginBottom: "20px" }}>
              <h3>Images</h3>
              <input 
                type="file" 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*"
                disabled={uploading}
                style={{ marginBottom: "10px" }}
              />
              {uploading && <p style={{ color: "#666" }}>Uploading images...</p>}
              
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px", gap: "10px" }}>
                {formData.imageUrl.map((url, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt={`Preview ${i}`}
                      style={{ 
                        width: "120px", 
                        height: "80px", 
                        objectFit: "cover",
                        border: "1px solid #ddd",
                        borderRadius: "4px"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3>YouTube Links</h3>
              <div style={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Enter YouTube URL"
                  value={youtubeLinkInput}
                  onChange={(e) => setYoutubeLinkInput(e.target.value)}
                  style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
                <button
                  type="button"
                  onClick={handleAddYoutubeLink}
                  style={{ 
                    padding: "8px 16px", 
                    background: "#4CAF50", 
                    color: "white", 
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Add Link
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {formData.youtubeLinks.map((link, i) => (
                  <div key={i} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "8px",
                    background: "#f5f5f5",
                    borderRadius: "4px"
                  }}>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <a href={normalizeYoutubeLink(link)} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveYoutubeLink(i)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        marginLeft: "10px",
                        cursor: "pointer",
                        padding: "4px 8px"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="submit" 
                style={{ 
                  padding: "8px 16px", 
                  background: "#4CAF50", 
                  color: "white", 
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                disabled={uploading}
              >
                {isEditing ? "Update" : "Add"} Ad
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  style={{ 
                    padding: "8px 16px", 
                    background: "#f44336", 
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="ads-list" style={{ marginTop: "30px" }}>
        {ads.length > 0 && (
          <>
            <h2>Existing Ads</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="ad-card"
                  style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "6px",
                  }}
                >
                  <h3>Images:</h3>
                  {ad.imageUrl.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                      {ad.imageUrl.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Ad ${i}`}
                          style={{ 
                            width: "100%", 
                            height: "120px", 
                            objectFit: "cover",
                            border: "1px solid #ddd",
                            borderRadius: "4px"
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#666", marginBottom: "20px" }}>No images</p>
                  )}

                  <h3>YouTube Links:</h3>
                  {ad.youtubeLinks.length > 0 ? (
                    <div style={{ marginBottom: "20px" }}>
                      {ad.youtubeLinks.map((link, i) => (
                        <div key={i} style={{ marginBottom: "5px", wordBreak: "break-all" }}>
                          <a href={normalizeYoutubeLink(link)} target="_blank" rel="noopener noreferrer">
                            {link}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#666", marginBottom: "20px" }}>No YouTube links</p>
                  )}

                  <button
                    onClick={() => handleEdit(ad)}
                    style={{ 
                      padding: "8px 16px",
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      width: "100%"
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}