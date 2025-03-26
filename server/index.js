// server/index.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// Add this to your main server file (index.js or server.js)
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/build')));
    
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
//     });
//   }

// Google OAuth Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://letter-creator-server.onrender.com/auth/google/callback",
    scope: [
      'profile', 
      'email',
      'https://www.googleapis.com/auth/drive.file' // Scope for Google Drive
    ]
  },
  (accessToken, refreshToken, profile, done) => {
    // Store tokens with user data
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      accessToken,
      refreshToken
    };
    
    return done(null, user);
  }
));

// Auth Routes
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Create JWT token
    const token = jwt.sign(
      { 
        id: req.user.id, 
        email: req.user.email,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Google Drive API Integration
// In server/index.js, update the save-letter endpoint
app.post('/api/save-letter', authenticateToken, async (req, res) => {
    try {
      const { title, content } = req.body;
      const { accessToken } = req.user;
      
      // Initialize Google Drive API
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      
      // Check if "Letters" folder exists, create if not
      let folderId;
      const folderResponse = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and name='Letters'",
        fields: 'files(id, name)'
      });
      
      if (folderResponse.data.files.length > 0) {
        folderId = folderResponse.data.files[0].id;
      } else {
        const folderMetadata = {
          name: 'Letters',
          mimeType: 'application/vnd.google-apps.folder'
        };
        
        const folder = await drive.files.create({
          resource: folderMetadata,
          fields: 'id'
        });
        
        folderId = folder.data.id;
      }
      
      // Create a temporary HTML file
      const tempFileName = `${title || 'Untitled Letter'}.html`;
      const htmlContent = `<!DOCTYPE html><html><head><title>${title}</title></head><body>${content}</body></html>`;
      
      // Create the file with HTML content in Drive
      const fileMetadata = {
        name: tempFileName,
        parents: [folderId]
      };
      
      const media = {
        mimeType: 'text/html',
        body: htmlContent
      };
      
      // Upload HTML file
      const htmlFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      });
      
      // Convert to Google Doc
      const docMetadata = {
        name: title || 'Untitled Letter',
        mimeType: 'application/vnd.google-apps.document',
        parents: [folderId]
      };
      
      // Copy the HTML file to a Google Doc
      const docFile = await drive.files.copy({
        fileId: htmlFile.data.id,
        resource: docMetadata,
        fields: 'id,webViewLink'
      });
      
      // Delete the temporary HTML file
      await drive.files.delete({
        fileId: htmlFile.data.id
      });
      
      res.status(200).json({ 
        success: true, 
        fileId: docFile.data.id,
        webViewLink: docFile.data.webViewLink,
        message: 'Letter saved to Google Drive'
      });
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      res.status(500).json({ error: 'Failed to save letter' });
    }
  });


// Get user's letters
app.get('/api/letters', authenticateToken, async (req, res) => {
    try {
      const { accessToken } = req.user;
      
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      
      // Find the Letters folder
      const folderResponse = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and name='Letters'",
        fields: 'files(id)'
      });
      
      if (folderResponse.data.files.length === 0) {
        return res.status(200).json({ letters: [] });
      }
      
      const folderId = folderResponse.data.files[0].id;
      
      // Get files in the Letters folder
      const response = await drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document'`,
        fields: 'files(id, name, webViewLink, createdTime)'
      });
      
      res.status(200).json({ letters: response.data.files });
    } catch (error) {
      console.error('Error fetching letters:', error);
      res.status(500).json({ error: 'Failed to fetch letters' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
