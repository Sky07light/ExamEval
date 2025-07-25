# ExamEval Backend Setup Guide

Welcome to the ExamEval backend! This guide will help you set up and run the complete AI-powered exam evaluation system.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration (see [Environment Configuration](#environment-configuration) below).

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Seed the database (optional but recommended):**
   ```bash
   npm run seed
   ```

The API will be available at `http://localhost:5000`

## 🔧 Environment Configuration

Update your `.env` file with the following configurations:

### Required Settings

```env
# Database (Required)
MONGODB_URI=mongodb://localhost:27017/exameval
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exameval

# JWT Configuration (Required)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d
```

### Optional Settings

```env
# AI Services (Optional but recommended for full functionality)
OPENAI_API_KEY=your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@exameval.com
FROM_NAME=ExamEval System
```

## 🤖 AI Integration Setup

### OpenAI Setup (Recommended)

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Add it to your `.env` file:
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

### Google Gemini Setup (Alternative)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env` file:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

## 📧 Email Configuration

For email notifications (welcome emails, exam notifications, results):

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update your `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

## 🗄️ Database Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```
3. Use the default connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/exameval
   ```

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get connection string and update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exameval
   ```

## 🌱 Database Seeding

Populate your database with sample data:

```bash
# Add sample users, exams, and evaluations
npm run seed

# Clear all data
npm run seed:delete
```

### Sample Users Created

After seeding, you can login with:

- **Admin**: admin@exameval.com / password123
- **Teacher**: teacher@exameval.com / password123
- **Student**: student@exameval.com / password123

## 🚦 Available Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
npm run server      # Start server directly

# Database
npm run seed        # Seed database with sample data
npm run seed:delete # Clear all data

# Testing
npm test           # Run tests (when implemented)
```

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Exams
- `GET /api/v1/exams` - Get all exams
- `POST /api/v1/exams` - Create new exam (Teacher only)
- `GET /api/v1/exams/:id` - Get single exam
- `PUT /api/v1/exams/:id` - Update exam (Teacher only)
- `DELETE /api/v1/exams/:id` - Delete exam (Teacher only)

### Evaluations
- `GET /api/v1/evaluations` - Get evaluations
- `POST /api/v1/evaluations` - Submit exam answers (Student)
- `PUT /api/v1/evaluations/:id` - Manual review (Teacher)
- `GET /api/v1/evaluations/stats` - Get statistics

### File Uploads
- `POST /api/v1/uploads` - Upload files (PDF, DOC, images)
- `GET /api/v1/uploads` - Get uploaded files
- `DELETE /api/v1/uploads/:filename` - Delete file

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard statistics
- `GET /api/v1/analytics/performance` - Performance analytics

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent API abuse
- **CORS Configuration** for cross-origin requests
- **Input Validation** using express-validator
- **File Upload Security** with type and size restrictions

## 🎯 Key Features

### AI-Powered Evaluation
- Automatic evaluation of subjective answers
- Support for OpenAI GPT-4 and Google Gemini
- Fallback evaluation for offline scenarios
- Detailed feedback generation

### File Processing
- PDF text extraction
- Word document processing
- Image OCR using Tesseract.js
- Thumbnail generation for images

### Email Notifications
- Welcome emails for new users
- Exam assignment notifications
- Results availability alerts
- Bulk notification system

### Comprehensive Analytics
- Student performance tracking
- Grade distribution analysis
- Subject-wise statistics
- Progress monitoring

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity for Atlas

2. **JWT Errors**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration settings

3. **File Upload Issues**
   - Verify uploads directory exists
   - Check file size limits
   - Ensure proper file permissions

4. **Email Not Sending**
   - Verify SMTP configuration
   - Check app password for Gmail
   - Test with a simple email service first

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 🚀 Production Deployment

### Environment Preparation

1. **Set production environment:**
   ```env
   NODE_ENV=production
   ```

2. **Use strong secrets:**
   ```bash
   # Generate secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Configure production database:**
   - Use MongoDB Atlas or dedicated MongoDB server
   - Enable authentication and SSL

4. **Set up reverse proxy (Nginx example):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Security Checklist

- [ ] Change all default passwords
- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Regular security updates

## 📞 Support

If you encounter any issues:

1. Check the logs for error messages
2. Verify your environment configuration
3. Ensure all dependencies are installed
4. Check the troubleshooting section above

## 🔄 Updates

To update the backend:

```bash
git pull origin main
npm install
npm run seed  # If database schema changed
npm start
```

---

Happy coding! 🎉 The ExamEval backend is now ready to power your AI-driven exam evaluation system.