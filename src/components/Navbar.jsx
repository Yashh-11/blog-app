import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📝 BlogHub
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {user ? (
            <>
              <Link to="/my-blogs" className="nav-link">My Blogs</Link>
              <Link to="/add-blog" className="nav-link btn-add">Add Blog</Link>
              
              <div className="user-info">
                <span className="user-name">👤 {user.username}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn-login">Login</Link>
              <Link to="/signup" className="nav-link btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
