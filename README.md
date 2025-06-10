# 🔗 Deployed Application:
https://letter-creator-client.onrender.com


# Implementation Overview

I have developed a comprehensive solution that includes:

1. Google OAuth Authentication - Implemented secure user authentication using Google's OAuth 2.0 protocol
2. Letter Creation & Editing Interface - Designed an intuitive text editor with formatting capabilities
3. Google Drive Integration - Engineered seamless integration with Google Drive API to store documents
4. Organizational Structure - Implemented automatic creation and management of a dedicated "Letters" folder


# Technical Architecture

The application is built using a modern technology stack:

* Frontend: React.js with responsive design principles
* Backend: Node.js with Express
* Authentication: Passport.js with Google OAuth 2.0
* Cloud Storage: Google Drive API integration
* Deployment: Render cloud platform


# Testing Instructions

To evaluate the application:

1. Visit https://letter-creator-client.onrender.com
2. Authenticate using Google Sign-in
3. Important for new Gmail accounts: When prompted, select "See, edit, create and delete only the specific Google Drive files that you use with this app" to grant the necessary permissions. This access is required for the core functionality of our application to save letters to your Google Drive.
4. Create and format a letter in the editor
5. Save the document to Google Drive
6. View your saved letters in the "My Letters" section
