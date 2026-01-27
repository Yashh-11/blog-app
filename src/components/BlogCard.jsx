import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, onLike, onDelete, isOwner, isLiked }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blog-card">

      <div className="blog-image">
        <img src={blog.image} alt={blog.title} />
      </div>
      <div className="blog-content">
        <h3>{blog.title}</h3>
        <p className="blog-author">By <strong>{blog.author}</strong></p>
        <p className="blog-description">{blog.description}</p>
        

        <div className="blog-footer">
          <span className="blog-date">{formatDate(blog.createdAt)}</span>
          
          <div className="blog-actions">

            {onLike && (
              <button 
                className={`btn-like ${isLiked ? 'liked' : ''}`}
                onClick={onLike}
              >
                ❤️ {blog.likes}
              </button>
            )}
            

            {isOwner && (
              <>
                <Link to={`/edit-blog/${blog.id}`} className="btn-edit">
                  ✏️ Edit
                </Link>
                <button className="btn-delete" onClick={onDelete}>
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
