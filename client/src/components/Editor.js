// client/src/components/Editor.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import './Editor.css';

function Editor({ user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { id } = useParams();
  const navigate = useNavigate();
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];
  
  const saveLetter = async () => {
    if (!title.trim()) {
      setMessage({ text: 'Please add a title', type: 'error' });
      return;
    }
    
    try {
      setSaving(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/save-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Letter saved to Google Drive!', type: 'success' });
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: data.error || 'Error saving letter', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving letter:', error);
      setMessage({ text: 'Failed to save letter', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="editor-container">
      <div className="editor-header">
        <button className="back-button" onClick={() => navigate('/letters')}>
          <FaArrowLeft /> Back to Letters
        </button>
        <input
          type="text"
          placeholder="Letter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <button 
          className="save-button" 
          onClick={saveLetter} 
          disabled={saving}
        >
          {saving ? 'Saving...' : (
            <>
              <FaSave /> Save to Drive
            </>
          )}
        </button>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="editor-content">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Start writing your letter here..."
        />
      </div>
    </div>
  );
}

export default Editor;