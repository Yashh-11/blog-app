import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditBlog = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBlog();
  }, [user, id, navigate]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:3000/blogs/${id}`);
      const blog = await response.json();

      if (parseInt(blog.authorId) !== parseInt(user.id)) {
        alert('You can only edit your own blogs');
        navigate('/my-blogs');
        return;
      }

      setTitle(blog.title);
      setDescription(blog.description);
      setImage(blog.image);
      setImagePreview(blog.image);
      setError('');
    } catch (err) {
      setError('Failed to load blog');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

    setUpdating(true);

    try {
      const updatedBlog = {
        title,
        description,
        image,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`http://localhost:3000/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBlog)
      });

      if (response.ok) {
        navigate('/my-blogs');
      } else {
        setError('Failed to update blog');
      }
    } catch (err) {
      setError('Error updating blog: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading blog...</div>;

  return (
    <div className="blog-form-container">
      <div className="blog-form-card">
        <h1>Edit Blog</h1>
        
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
                  value={image}
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

          <div className="form-actions">
            <button type="submit" disabled={updating} className="btn-primary">
              {updating ? 'Updating...' : 'Update Blog'}
            </button>
            <button type="button" onClick={() => navigate('/my-blogs')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
