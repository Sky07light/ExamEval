# ExamEval Backend API

A comprehensive REST API for the ExamEval AI-powered exam evaluation system.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for students, teachers, and admin roles
- **Exam Management**: Create, update, and manage exams with questions
- **AI Evaluation**: Automated evaluation of student answers
- **File Upload**: Support for various file formats (PDF, DOC, images)
- **Analytics**: Comprehensive analytics and reporting
- **Security**: Rate limiting, CORS, helmet, and input validation

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **File Upload**: Multer with local storage
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Set your MongoDB connection string
   - Generate a secure JWT secret
   - Configure email settings (optional)
   - Add AI service API keys (optional)

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `PUT /api/v1/auth/password` - Update password

### Users
- `GET /api/v1/users` - Get all users (Admin/Teacher)
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin)
- `GET /api/v1/users/stats` - Get user statistics

### Exams
- `GET /api/v1/exams` - Get all exams
- `POST /api/v1/exams` - Create exam (Teacher)
- `GET /api/v1/exams/:id` - Get single exam
- `PUT /api/v1/exams/:id` - Update exam (Teacher)
- `DELETE /api/v1/exams/:id` - Delete exam (Teacher)
- `GET /api/v1/exams/stats` - Get exam statistics

### Evaluations
- `GET /api/v1/evaluations` - Get all evaluations
- `POST /api/v1/evaluations` - Create evaluation
- `GET /api/v1/evaluations/:id` - Get single evaluation
- `PUT /api/v1/evaluations/:id` - Update evaluation
- `DELETE /api/v1/evaluations/:id` - Delete evaluation (Teacher)
- `GET /api/v1/evaluations/stats` - Get evaluation statistics

### File Uploads
- `POST /api/v1/uploads` - Upload files
- `GET /api/v1/uploads` - Get uploaded files
- `DELETE /api/v1/uploads/:filename` - Delete file

### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard stats
- `GET /api/v1/analytics/performance` - Get performance analytics
- `GET /api/v1/analytics/subjects` - Get subject analytics
- `GET /api/v1/analytics/student-progress/:studentId` - Get student progress

## Database Models

### User
- Personal information (name, email, role)
- Authentication data (password hash)
- Preferences and settings
- Role-specific fields (subjects for teachers, class info for students)

### Exam
- Exam metadata (title, subject, class, duration)
- Questions with model answers and rubrics
- Evaluation settings
- File attachments

### Evaluation
- Student answers and AI evaluation results
- Marks, grades, and feedback
- Performance metrics and analytics
- Status tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Type and size restrictions

## Error Handling

The API uses a centralized error handling system with:
- Custom error classes
- Mongoose error handling
- JWT error handling
- File upload error handling
- Development vs production error responses

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Project Structure
```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── server.js       # Main server file
├── uploads/            # File upload directory
├── .env               # Environment variables
└── package.json       # Dependencies and scripts
```

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Write meaningful commit messages
5. Test your changes thoroughly

## License

This project is licensed under the MIT License.