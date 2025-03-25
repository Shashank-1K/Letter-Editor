// client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, onLogout, user }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAuthenticated ? "/letters" : "/"}>Letter Creator</Link>
      </div>
      
      {isAuthenticated && (
        <div className="navbar-menu">
          <div className="user-info">
            {user?.email}
          </div>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;