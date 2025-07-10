import React from 'react';
import './Blogs.css'; // Import CSS for styling
import doctor from '../../assets/hospital-img.jpg'; // Example image, replace with actual image path

// Example blog posts (replace this with dynamic data from an API if needed)
const blogPosts = [
  {
    id: 1,
    title: '10 Tips to Stay Healthy During Winter',
    excerpt: 'With the winter season approaching, it’s important to know how to take care of your health. Here are 10 tips to stay healthy during the cold months.',
    date: '2023-11-01',
    author: 'Dr. Sarah Lee',
    imgSrc: doctor, // Example image
    category: 'Health Tips',
    path: '/blogs/tips-to-stay-healthy-during-winter'
  },
  {
    id: 2,
    title: 'Meet Dr. John Doe: Our Expert Cardiologist',
    excerpt: 'Get to know Dr. John Doe, one of our top cardiologists. Learn about his approach to patient care and his vast experience in treating heart diseases.',
    date: '2023-10-15',
    author: 'Hospital Admin',
    imgSrc:doctor, // Example image
    category: 'Doctor Features',
    path: '/blogs/dr-john-doe-cardiologist'
  },
  {
    id: 3,
    title: 'Success Story: A Patient’s Journey to Recovery',
    excerpt: 'Read how one of our patients overcame their illness and is now living a healthy and happy life after treatment at our hospital.',
    date: '2023-09-30',
    author: 'Patient Stories Team',
    imgSrc: doctor, // Example image
    category: 'Patient Stories',
    path: '/blogs/patient-journey-to-recovery'
  },
  // Add more blog posts here...
];

export default function HospitalBlogs() {
  return (
    <div className="hospital-blogs-container">
      <header className="hero-section">
        <h1>Hospital Blog</h1>
        <p>Stay updated with our latest health tips, doctor interviews, patient stories, and hospital news.</p>
      </header>

      <div className="blog-categories">
        <h2>Blog Categories</h2>
        <div className="category-list">
          <button className="category-button">Health Tips</button>
          <button className="category-button">Doctor Features</button>
          <button className="category-button">Patient Stories</button>
          <button className="category-button">Hospital Updates</button>
        </div>
      </div>

      <div className="blog-list">
        <h2>Latest Posts</h2>
        {blogPosts.map((post) => (
          <div key={post.id} className="blog-card">
            <img src={post.imgSrc} alt={post.title} className="blog-image" />
            <div className="blog-content">
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-footer">
                <span className="blog-date">{post.date}</span>
                <span className="blog-author">By {post.author}</span>
              </div>
              {/* <Link to={post.path} className="blog-read-more">Read More</Link> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
