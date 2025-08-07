// import React, { useEffect, useState } from 'react';
// import './Blogs.css';
// import { getBlogs, createBlog, deleteBlog, updateBlog , uploadImage} from '../../api/api';

// export default function HospitalBlogs() {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [imageUploading, setImageUploading] = useState(false);


//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     author: '',
//     publishedDate: '',
//     status: 'Published',
//     category: '',
//     featuredImage: '',
//   });

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     setLoading(true);
//     try {
//       const response = await getBlogs();
//       if (response.data?.result === 'Success') {
//         const cleanedBlogs = response.data.resultData.map(blog => ({
//           ...blog,
//           publishedDate: blog.publishedDate?.slice(0, 10)
//         }));
//         setBlogs(cleanedBlogs);
//         setError('');
//       } else {
//         setError('Failed to load blogs.');
//       }
//     } catch (err) {
//       setError('Network error while fetching blogs.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const data = new FormData();
//   data.append('image', file);
//   setImageUploading(true);
//   try {
//     const res = await uploadImage(data);
    
//     const imageUrl = res.data?.imageUrl || "";
//     if (imageUrl) {
//       setFormData((prev) => ({ ...prev, featuredImage: imageUrl }));
//     } else {
//       setError('Image upload failed.');
//     }
//   } catch (err) {
//     setError('Network error while uploading image.');
//   } finally {
//     setImageUploading(false);
//   }
// };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleOpenModal = (blog = null) => {
//     if (blog) {
//       setFormData(blog);
//       setIsEditMode(true);
//       setEditingId(blog.id);
//     } else {
//       setFormData({
//         title: '',
//         content: '',
//         author: '',
//         publishedDate: '',
//         status: 'Published',
//         category: '',
//         featuredImage: '',
//       });
//       setIsEditMode(false);
//       setEditingId(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       if (isEditMode && editingId) {
//         await updateBlog(editingId, formData);
//       } else {
//         await createBlog(formData);
//       }
//       setError('');
//       document.getElementById('closeModalBtn').click(); // Close modal
//       fetchBlogs(); // Refresh list
//     } catch (err) {
//       setError('Failed to submit blog. Check your input or try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this blog?')) {
//       try {
//         await deleteBlog(id);
//         fetchBlogs();
//       } catch (err) {
//         setError('Failed to delete blog.');
//       }
//     }
//   };

//   const formatDate = (dateStr) =>
//     new Date(dateStr).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });

//   return (
//     <div className="hospital-blogs-container container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div>
//           <h1>Hospital Blog</h1>
//           <p className="text-muted">Stay updated with our latest blog posts.</p>
//         </div>
//         <button
//           className="btn btn-primary"
//           data-bs-toggle="modal"
//           data-bs-target="#blogModal"
//           onClick={() => handleOpenModal(null)}
//         >
//           + Add Blog
//         </button>
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}
//       {loading ? (
//         <p>Loading...</p>
//       ) : blogs.length === 0 ? (
//         <p>No blog posts found.</p>
//       ) : (
//         <div className="row">
//           {blogs.map((post) => (
//             <div key={post.id} className="col-md-4 mb-4">
//               <div className="card h-100 shadow">
//                 <img
//                   src={post.featuredImage || 'https://via.placeholder.com/300'}
//                   alt={post.title}
//                   className="card-img-top"
//                   style={{ height: '200px', objectFit: 'cover' }}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{post.title}</h5>
//                   <p className="card-text">
//                     {post.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
//                   </p>
//                 </div>
//                 <div className="card-footer d-flex justify-content-between align-items-center small text-muted">
//                   <span>{formatDate(post.publishedDate)} — {post.author}</span>
//                   <div>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       data-bs-toggle="modal"
//                       data-bs-target="#blogModal"
//                       onClick={() => handleOpenModal(post)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleDelete(post.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal */}
//       <div
//         className="modal fade"
//         id="blogModal"
//         tabIndex="-1"
//         aria-labelledby="blogModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-lg">
//           <form onSubmit={handleSubmit} className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="blogModalLabel">
//                 {isEditMode ? 'Edit Blog' : 'Add New Blog'}
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 id="closeModalBtn"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">Title</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Author</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="author"
//                   value={formData.author}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Published Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   name="publishedDate"
//                   value={formData.publishedDate.slice(0, 10)}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//   <label className="form-label">Upload Featured Image</label>
//   <input
//     type="file"
//     accept="image/*"
//     className="form-control"
//     onChange={handleImageUpload}
//   />
//   {imageUploading && <small className="text-info">Uploading image...</small>}
//   {formData.featuredImage && (
//     <img
//       src={formData.featuredImage}
//       alt="Preview"
//       className="mt-2 rounded"
//       style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }}
//     />
//   )}
// </div>

//               <div className="col-12">
//                 <label className="form-label">Content</label>
//                 <textarea
//                   className="form-control"
//                   name="content"
//                   rows="5"
//                   value={formData.content}
//                   onChange={handleInputChange}
//                   required
//                 ></textarea>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-success" disabled={submitting}>
//                 {submitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Blogs.css';
import { getBlogTopics, createBlogTopic, deleteBlogTopic, updateBlogTopic, uploadImage } from '../../api/api';

export default function BlogTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  const initialFormState = {
    topic: '',
    description: '',
    bannerUrl: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await getBlogTopics();
      if (response.data?.result === 'Success') {
        setTopics(response.data.resultData);
        setError('');
      } else {
        setError(response.data?.message || 'Failed to load topics.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Network error while fetching topics.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    const data = new FormData();
    data.append('image', file);
    setImageUploading(true);
    try {
      const res = await uploadImage(data);
      const imageUrl = res.data?.imageUrl || res.data?.url || "";
      if (imageUrl) {
        setFormData(prev => ({ ...prev, bannerUrl: imageUrl }));
      } else {
        setError('Image upload failed - no URL returned');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (topic = null, e) => {
    if (e) e.stopPropagation();
    if (topic) {
      setFormData(topic);
      setIsEditMode(true);
      setEditingId(topic.id);
    } else {
      setFormData(initialFormState);
      setIsEditMode(false);
      setEditingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      setError('Topic name is required');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      if (isEditMode && editingId) {
        await updateBlogTopic(editingId, formData);
      } else {
        await createBlogTopic(formData);
      }
      document.getElementById('closeModalBtn').click();
      await fetchTopics();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Failed to submit topic. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteBlogTopic(id);
        await fetchTopics();
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.response?.data?.message || 'Failed to delete topic.');
      }
    }
  };

  const handleTopicClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  return (
    <div className="hospital-blogs-container container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Blog Topics</h1>
          <p className="text-muted">Manage your blog categories and topics.</p>
        </div>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#topicModal"
          onClick={() => handleOpenModal(null)}
        >
          + Add Topic
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : topics.length === 0 ? (
        <div className="alert alert-info">No topics found.</div>
      ) : (
        <div className="row">
          {topics.map((topic) => (
            <div key={topic.id} className="col-md-4 mb-4">
              <div 
                className="card h-100 shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => handleTopicClick(topic.id)}
              >
                <img
                  src={topic.bannerUrl || 'https://via.placeholder.com/300x200?text=Topic+Image'}
                  alt={topic.topic}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{topic.topic}</h5>
                  <p className="card-text">
                    {topic.description || 'No description provided'}
                  </p>
                </div>
                <div 
                  className="card-footer d-flex justify-content-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#topicModal"
                    onClick={(e) => handleOpenModal(topic, e)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => handleDelete(topic.id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="modal fade" id="topicModal" tabIndex="-1" aria-labelledby="topicModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={handleSubmit} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="topicModalLabel">
                {isEditMode ? 'Edit Topic' : 'Add New Topic'}
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
              <div className="mb-3">
                <label className="form-label">Topic Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                />
                {imageUploading && <small className="text-info">Uploading image...</small>}
                {formData.bannerUrl && (
                  <img
                    src={formData.bannerUrl}
                    alt="Preview"
                    className="mt-2 rounded"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={submitting || imageUploading}>
                {submitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}