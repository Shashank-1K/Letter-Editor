// client/src/components/Login.js
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaRegEnvelope, FaRegSave } from 'react-icons/fa';
import './Login.css';

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <div className="app-info">
            <h1>Letter Creator</h1>
            <p className="tagline">Craft beautiful letters and save directly to Google Drive</p>
            
            <div className="features">
              <div className="feature-item">
                <div className="feature-icon"><FcGoogle /></div>
                <div className="feature-text">
                  <h3>Simple Sign-in</h3>
                  <p>Quick and secure login with your Google account</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon"><FaRegEnvelope /></div>
                <div className="feature-text">
                  <h3>Intuitive Editor</h3>
                  <p>Create and format professional letters with ease</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon"><FaRegSave /></div>
                <div className="feature-text">
                  <h3>Google Drive Integration</h3>
                  <p>Save and access your letters from anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Get Started</h2>
              <p>Sign in to create and manage your letters</p>
            </div>
            
            <button className="google-button" onClick={handleGoogleLogin}>
              <FcGoogle className="google-icon" />
              Sign in with Google
            </button>
            
            <div className="login-footer">
              <p>By signing in, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;