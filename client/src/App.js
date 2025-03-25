// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Editor from './components/Editor';
import LettersList from './components/LettersList';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for token in URL (after Google OAuth redirect)
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    
    if (token) {
      localStorage.setItem('token', token);

      // client/src/App.js (continued)
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Decode token to get user info
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const userData = JSON.parse(jsonPayload);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    
    // Check for existing token in localStorage
    const existingToken = localStorage.getItem('token');
    if (existingToken && !isAuthenticated) {
      try {
        const base64Url = existingToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const userData = JSON.parse(jsonPayload);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing existing token:', error);
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, [isAuthenticated]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/letters" />} />
          <Route 
            path="/editor" 
            element={isAuthenticated ? <Editor user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/editor/:id" 
            element={isAuthenticated ? <Editor user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/letters" 
            element={isAuthenticated ? <LettersList user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;