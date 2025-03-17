# Zenfoline Backend

A robust backend system for a portfolio builder application that allows users to create and manage their portfolios with different templates and customization options.

## Features

### Admin Features

1. **Authentication**
   - Admin signup with username and email
   - Admin login with credentials
   - Role-based access control

2. **Template Management**
   - Add new templates with:
     - Name and description
     - Category (developer, student, content-creator, designer, lawyer)
     - Template image
     - Predefined template selection
   - Edit existing templates
   - Delete templates
   - Configure section visibility and order for each template

3. **Component Management**
   - Add predefined components (headers, footers)
   - Link components to specific templates
   - Toggle component visibility
   - Delete components
   - Manage component categories and types

### User Features

1. **Authentication**
   - User registration with email verification (OTP)
   - User login
   - Password reset functionality with OTP
   - Email verification system

2. **Template Management**
   - View available templates
   - Activate/deactivate templates
   - Get active template information

3. **Theme Customization**
   - Update theme settings:
     - Color mode (default, light, dark)
     - Font style selection
     - Preset theme selection
   - Save and retrieve theme preferences

4. **Portfolio Management**
   - Initialize portfolio with type selection
   - Manage portfolio sections:
     - Basic Information
     - About
     - Skills
     - Experience
     - Education
     - Projects
     - Certifications
     - Publications
     - Awards
     - Services
     - Custom Sections
   - Control section visibility
   - Reorder sections
   - Upload and manage images

## API Endpoints

### Admin Routes

```
POST /admin/signup - Register new admin
POST /admin/login - Admin login
POST /admin/templates - Add new template
PUT /admin/templates/:id - Update template
DELETE /admin/templates/:id - Delete template
POST /admin/components - Add new component
PUT /admin/components/:id - Update component
DELETE /admin/components/:id - Delete component
```

### User Authentication Routes

```
POST /auth/signup - Register new user
POST /auth/verify - Verify registration OTP
POST /auth/login - User login
POST /auth/forgot-password - Request password reset
POST /auth/verify-forgot-password - Verify password reset OTP
POST /auth/update-password - Update password
POST /auth/resend-otp - Resend verification OTP
```

### User Portfolio Routes

```
POST /authenticated-user/portfolio/initialize - Initialize portfolio
GET /authenticated-user/portfolio/:userId - Get portfolio data
PATCH /authenticated-user/portfolio/:userId/type - Update portfolio type
PATCH /authenticated-user/portfolio/:userId/sections/order - Update section order

// Section Management
POST /portfolio/:userId/basics - Update basic information
POST /portfolio/:userId/:section - Add section item
PUT /portfolio/:userId/:section/:itemId - Update section item
DELETE /portfolio/:userId/:section/:itemId - Delete section item
PATCH /portfolio/:userId/:section/visibility - Update section visibility

// Image Management
POST /portfolio/:userId/upload/:type - Upload profile/cover images
POST /portfolio/:userId/:section/:itemId/upload - Upload section images
```

### Theme Routes

```
POST /authenticated-user/updatetheme - Update theme settings
GET /authenticated-user/gettheme - Get theme settings
GET /authenticated-user/getactivecomponents - Get active components
```

## Data Models

1. **User Model**
   - Email, password, verification status
   - Selected template reference
   - Portfolio data reference

2. **Template Model**
   - Basic template information
   - Section configuration
   - Category specification
   - Component associations

3. **Portfolio Data Model**
   - User reference
   - Portfolio type
   - Section data (basics, skills, experience, etc.)
   - Section visibility settings

4. **Theme Model**
   - User reference
   - Color mode
   - Font selections
   - Preset theme settings

5. **Component Model**
   - Component type and category
   - Template association
   - Visibility settings

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Current Development Status

The backend currently supports:
- Complete authentication system for both admin and users
- Template and component management system
- Portfolio data management with section control
- Theme customization and persistence
- File upload system for images
- Email notification system for authentication

Next planned features:
- Advanced search and filtering for templates
- Analytics for template usage
- User activity logging
- Backup and restore functionality
- API rate limiting and security enhancements

## Security Features

- Password hashing using bcrypt
- OTP-based email verification
- Protected routes with authentication
- Input validation and sanitization
- Secure file upload handling
- Error logging and handling

## Error Handling

The API implements consistent error handling with appropriate HTTP status codes and error messages for:
- Invalid requests
- Authentication failures
- Database errors
- File upload issues
- Validation errors 