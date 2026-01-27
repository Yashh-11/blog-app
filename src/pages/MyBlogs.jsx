import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyBlogs();
  }, [user, navigate]);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/blogs');
      const allBlogs = await response.json();
      
      const userId = parseInt(user.id);
      const myBlogs = allBlogs.filter(blog => parseInt(blog.authorId) === userId);
      
      setBlogs(myBlogs);
      setError('');
    } catch (err) {
      setError('Failed to fetch your blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`http://localhost:3000/blogs/${blogId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchMyBlogs();
        }
      } catch (err) {
        console.error('Error deleting blog:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading your blogs...</div>;

  return (
    <div className="my-blogs-container">
      <div className="my-blogs-header">
        <h1>My Blogs</h1>
        <Link to="/add-blog" className="btn-primary">
          ✍️ Write New Blog
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {blogs.length === 0 ? (
        <div className="no-blogs">
          <p>You haven't written any blogs yet.</p>
          <Link to="/add-blog" className="btn-primary">
            Start Writing Now
          </Link>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onDelete={() => handleDelete(blog.id)}
              isOwner={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
