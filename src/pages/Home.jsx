import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/blogs`);
      const data = await response.json();
      setBlogs(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId) => {
    if (!user) {
      alert('Please login to like blogs');
      return;
    }

    try {
      const blog = blogs.find(b => b.id === blogId);
      const isAlreadyLiked = blog.likedBy && blog.likedBy.includes(parseInt(user.id));
      
      const updatedLikes = isAlreadyLiked ? blog.likes - 1 : blog.likes + 1;
      const updatedLikedBy = isAlreadyLiked 
        ? blog.likedBy.filter(id => id !== parseInt(user.id))
        : [...(blog.likedBy || []), parseInt(user.id)];

      const response = await fetch(`${API_URL}/blogs/${blogId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likes: updatedLikes,
          likedBy: updatedLikedBy
        })
      });

      if (response.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };

  const handleDelete = async (blogId) => {
    const blog = blogs.find(b => b.id === blogId);
    
    if (parseInt(blog.authorId) !== parseInt(user?.id)) {
      alert('You can only delete your own blogs');
      return;
    }

    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`${API_URL}/blogs/${blogId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchBlogs();
        }
      } catch (err) {
        console.error('Error deleting blog:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading blogs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Blog Hub</h1>
        <p>Explore amazing stories and insights from our community</p>
        {user && (
          <Link to="/add-blog" className="btn-primary">
            ✍️ Write a New Blog
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="no-blogs">
          <p>No blogs yet. Be the first to write one!</p>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onLike={() => handleLike(blog.id)}
              onDelete={() => handleDelete(blog.id)}
              isOwner={parseInt(user?.id) === parseInt(blog.authorId)}
              isLiked={blog.likedBy && blog.likedBy.includes(parseInt(user?.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
