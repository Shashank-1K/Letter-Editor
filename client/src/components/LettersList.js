// client/src/components/LettersList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaExternalLinkAlt, FaGoogle } from 'react-icons/fa';
import './LettersList.css';

function LettersList({ user }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchLetters();
  }, []);
  
  const fetchLetters = async () => {
    try {
      setLoading(true);
      // client/src/components/LettersList.js (continued)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/letters`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLetters(data.letters);
      } else {
        setError(data.error || 'Failed to fetch letters');
      }
    } catch (error) {
      console.error('Error fetching letters:', error);
      setError('Failed to fetch letters from Google Drive');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="letters-container">
      <div className="letters-header">
        <h1>My Letters</h1>
        <Link to="/editor" className="new-letter-button">
          <FaPlus /> New Letter
        </Link>
      </div>
      
      {loading ? (
        <div className="loading-letters">Loading your letters...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : letters.length === 0 ? (
        <div className="no-letters">
          <div className="empty-state">
            <FaGoogle className="google-drive-icon" />
            <h2>No letters found</h2>
            <p>Create your first letter by clicking the "New Letter" button</p>
          </div>
        </div>
      ) : (
        <div className="letters-list">
          {letters.map((letter) => (
            <div key={letter.id} className="letter-card">
              <h3 className="letter-title">{letter.name}</h3>
              <p className="letter-date">Created: {formatDate(letter.createdTime)}</p>
              <div className="letter-actions">
                <a 
                  href={letter.webViewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  <FaExternalLinkAlt /> Open in Drive
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LettersList;