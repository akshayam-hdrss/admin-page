import React, { useEffect, useState } from "react";
import { getAd, createAd, updateAd, uploadImage } from "../../api/api";

export default function Dashboard() {
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
  }, []);

  const fetchAds = async () => {
    try {
      const res = await getAd();
      setMessage(res.data.message || "");
      setAds(res.data.resultData || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);
        
        const res = await uploadImage(formDataUpload);
        console.log("Upload response:", res.data);
        
        if (res.data && res.data.imageUrl) {
          setFormData(prev => ({
            ...prev,
            imageUrl: [...prev.imageUrl, res.data.imageUrl]
          }));
        } else {
          console.error("Invalid response format - missing imageUrl");
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddYoutubeLink = () => {
    if (youtubeLinkInput.trim() === "") return;
    
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
    const payload = {
      imageUrl: formData.imageUrl,
      youtubeLinks: formData.youtubeLinks,
      typeId: null,
      itemId: null,
      category: "default",
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
      imageUrl: ad.imageUrl || [],
      youtubeLinks: ad.youtubeLinks || [],
    });
    setIsEditing(true);
    setEditingId(ad.id);
  };

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      <h1 className="dashboard-title">Ads Management</h1>

      {(message === "No table found" || isEditing || ads.length === 0) && (
        <div>
          <h2>{isEditing ? "Edit Ad" : "Add New Ad"}</h2>
          <form onSubmit={handleSubmit} className="ad-form">
            <div style={{ marginBottom: "20px" }}>
              <h3>Images</h3>
              <input 
                type="file" 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*"
                disabled={uploading}
              />
              {uploading && <p>Uploading images...</p>}
              
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                {formData.imageUrl.map((url, i) => (
                  <div key={i} style={{ position: "relative", margin: "5px" }}>
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
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3>YouTube Links</h3>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="Enter YouTube URL"
                  value={youtubeLinkInput}
                  onChange={(e) => setYoutubeLinkInput(e.target.value)}
                  style={{ flex: 1, marginRight: "10px", padding: "8px" }}
                />
                <button
                  type="button"
                  onClick={handleAddYoutubeLink}
                  style={{ padding: "8px 16px", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Add Link
                </button>
              </div>
              <div>
                {formData.youtubeLinks.map((link, i) => (
                  <div key={i} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "5px",
                    padding: "8px",
                    background: "#f5f5f5",
                    borderRadius: "4px"
                  }}>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
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
                  borderRadius: "4px"
                }}
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
                    borderRadius: "4px"
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
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="ad-card"
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                }}
              >
                <h3>Images:</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                  {ad.imageUrl?.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Ad ${i}`}
                      style={{ 
                        width: "160px", 
                        height: "100px", 
                        objectFit: "cover",
                        border: "1px solid #ddd",
                        borderRadius: "4px"
                      }}
                    />
                  ))}
                </div>

                <h3>YouTube Links:</h3>
                <div style={{ marginBottom: "20px" }}>
                  {ad.youtubeLinks?.map((link, i) => (
                    <div key={i} style={{ marginBottom: "5px" }}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleEdit(ad)}
                  style={{ 
                    padding: "8px 16px",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}