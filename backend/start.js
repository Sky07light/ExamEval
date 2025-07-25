#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvironment() {
  log('🔍 Checking environment configuration...', 'cyan');
  
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found!', 'red');
    log('📝 Creating .env file from .env.example...', 'yellow');
    
    const envExamplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ .env file created successfully!', 'green');
      log('⚠️  Please update the .env file with your actual configuration values.', 'yellow');
    } else {
      log('❌ .env.example file not found!', 'red');
      process.exit(1);
    }
  } else {
    log('✅ .env file found', 'green');
  }
}

function checkDirectories() {
  log('📁 Checking required directories...', 'cyan');
  
  const requiredDirs = [
    'uploads',
    'uploads/thumbnails'
  ];
  
  requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      log(`📝 Creating directory: ${dir}`, 'yellow');
      fs.mkdirSync(dirPath, { recursive: true });
      log(`✅ Directory created: ${dir}`, 'green');
    } else {
      log(`✅ Directory exists: ${dir}`, 'green');
    }
  });
}

function showStartupInfo() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🚀 ExamEval Backend API Server', 'bright');
  log('='.repeat(60), 'cyan');
  log('📖 Documentation: See README.md for API endpoints', 'blue');
  log('🌐 Frontend URL: http://localhost:5173', 'blue');
  log('🔧 API Base URL: http://localhost:5000/api/v1', 'blue');
  log('📊 Health Check: http://localhost:5000/health', 'blue');
  log('='.repeat(60), 'cyan');
  
  log('\n📋 Available API Endpoints:', 'bright');
  log('  Authentication:', 'yellow');
  log('    POST /api/v1/auth/register - Register user', 'blue');
  log('    POST /api/v1/auth/login - Login user', 'blue');
  log('    GET  /api/v1/auth/me - Get current user', 'blue');
  
  log('  Exams:', 'yellow');
  log('    GET  /api/v1/exams - Get all exams', 'blue');
  log('    POST /api/v1/exams - Create exam (Teacher)', 'blue');
  log('    GET  /api/v1/exams/:id - Get single exam', 'blue');
  
  log('  Evaluations:', 'yellow');
  log('    GET  /api/v1/evaluations - Get evaluations', 'blue');
  log('    POST /api/v1/evaluations - Submit exam (Student)', 'blue');
  log('    PUT  /api/v1/evaluations/:id - Update evaluation (Teacher)', 'blue');
  
  log('  File Uploads:', 'yellow');
  log('    POST /api/v1/uploads - Upload files', 'blue');
  log('    GET  /api/v1/uploads - Get uploaded files', 'blue');
  
  log('  Analytics:', 'yellow');
  log('    GET  /api/v1/analytics/dashboard - Dashboard stats', 'blue');
  log('    GET  /api/v1/analytics/performance - Performance analytics', 'blue');
  
  log('\n⚙️  Configuration Tips:', 'bright');
  log('  • Add your MongoDB URI to .env file', 'yellow');
  log('  • Add OpenAI or Gemini API key for AI evaluation', 'yellow');
  log('  • Configure SMTP settings for email notifications', 'yellow');
  log('  • Update JWT_SECRET for production deployment', 'yellow');
  
  log('\n🔐 Default Test Users (after seeding):', 'bright');
  log('  Admin: admin@exameval.com / password123', 'magenta');
  log('  Teacher: teacher@exameval.com / password123', 'magenta');
  log('  Student: student@exameval.com / password123', 'magenta');
  
  log('\n' + '='.repeat(60), 'cyan');
  log('🎯 Starting server...', 'green');
  log('='.repeat(60) + '\n', 'cyan');
}

async function startServer() {
  try {
    // Check environment and directories
    checkEnvironment();
    checkDirectories();
    
    // Show startup information
    showStartupInfo();
    
    // Import and start the server
    const server = await import('./src/server.js');
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      log('\n🛑 Received SIGTERM signal, shutting down gracefully...', 'yellow');
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      log('\n🛑 Received SIGINT signal, shutting down gracefully...', 'yellow');
      process.exit(0);
    });
    
  } catch (error) {
    log(`❌ Failed to start server: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Start the application
startServer();