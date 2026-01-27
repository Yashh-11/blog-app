import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = (e) => {
    const url = e.target.value;
    setImage(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !description.trim() || !image.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/blogs');
      const blogs = await response.json();
      
      const newId = blogs.length ? Math.max(...blogs.map(b => parseInt(b.id))) + 1 : 1;

      const newBlog = {
        id: newId,
        title,
        description,
        image,
        author: user.username,
        authorId: parseInt(user.id),
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const createResponse = await fetch('http://localhost:3000/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog)
      });

      if (createResponse.ok) {
        navigate('/my-blogs');
      } else {
        setError('Failed to create blog');
      }
    } catch (err) {
      setError('Error creating blog: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-form-container">
      <div className="blog-form-card">
        <h1>Create New Blog</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Blog Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your blog content here..."
              rows="8"
              required
            />
          </div>

          <div className="form-group">
            <label>Blog Image</label>
            <div className="image-input-group">
              <div className="image-input-method">
                <h4>Upload Image</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="image-input-divider">OR</div>
              <div className="image-input-method">
                <h4>Image URL</h4>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  onChange={handleImageUrl}
                />
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="image-preview">
              <h4>Preview</h4>
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Publishing...' : 'Publish Blog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
