import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Exam from '../models/Exam.js';
import Evaluation from '../models/Evaluation.js';
import connectDB from '../config/database.js';

// Load environment variables
dotenv.config();

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@exameval.com',
    password: 'password123',
    role: 'admin',
    institution: 'ExamEval System',
    isEmailVerified: true
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'teacher@exameval.com',
    password: 'password123',
    role: 'teacher',
    institution: 'Springfield High School',
    subjects: ['Mathematics', 'Physics'],
    bio: 'Experienced mathematics and physics teacher with 10+ years of experience.',
    isEmailVerified: true
  },
  {
    name: 'John Smith',
    email: 'student@exameval.com',
    password: 'password123',
    role: 'student',
    institution: 'Springfield High School',
    rollNumber: 'STU001',
    class: '12th Grade',
    section: 'A',
    isEmailVerified: true
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@exameval.com',
    password: 'password123',
    role: 'student',
    institution: 'Springfield High School',
    rollNumber: 'STU002',
    class: '12th Grade',
    section: 'A',
    isEmailVerified: true
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@exameval.com',
    password: 'password123',
    role: 'student',
    institution: 'Springfield High School',
    rollNumber: 'STU003',
    class: '12th Grade',
    section: 'B',
    isEmailVerified: true
  }
];

// Sample exams
const exams = [
  {
    title: 'Calculus Mid-Term Exam',
    subject: 'Mathematics',
    class: '12th Grade',
    section: 'A',
    duration: 120, // 2 hours
    instructions: 'Answer all questions. Show your work clearly. Use of calculators is not permitted.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    questions: [
      {
        questionNumber: 1,
        type: 'subjective',
        text: 'Find the derivative of f(x) = 3x³ - 2x² + 5x - 1 and evaluate it at x = 2.',
        marks: 10,
        modelAnswer: 'f\'(x) = 9x² - 4x + 5. At x = 2: f\'(2) = 9(4) - 4(2) + 5 = 36 - 8 + 5 = 33',
        rubric: 'Award 5 marks for correct derivative, 3 marks for substitution, 2 marks for final answer.'
      },
      {
        questionNumber: 2,
        type: 'subjective',
        text: 'Evaluate the integral ∫(2x + 3)dx from x = 0 to x = 4.',
        marks: 10,
        modelAnswer: '∫(2x + 3)dx = x² + 3x + C. From 0 to 4: [16 + 12] - [0 + 0] = 28',
        rubric: 'Award 4 marks for antiderivative, 4 marks for applying limits, 2 marks for final answer.'
      },
      {
        questionNumber: 3,
        type: 'mcq',
        text: 'What is the limit of (sin x)/x as x approaches 0?',
        marks: 5,
        options: ['0', '1', '∞', 'Does not exist'],
        correctAnswer: '1'
      }
    ],
    status: 'active',
    isPublished: true
  },
  {
    title: 'Physics Chapter 1: Motion',
    subject: 'Physics',
    class: '12th Grade',
    section: 'A',
    duration: 90, // 1.5 hours
    instructions: 'Answer all questions. Use appropriate units in your answers.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    questions: [
      {
        questionNumber: 1,
        type: 'subjective',
        text: 'A car accelerates from rest at 2 m/s² for 10 seconds. Calculate the distance traveled.',
        marks: 8,
        modelAnswer: 'Using s = ut + ½at²: s = 0 + ½(2)(10)² = 100 m',
        rubric: 'Award 3 marks for formula, 3 marks for substitution, 2 marks for answer with units.'
      },
      {
        questionNumber: 2,
        type: 'mcq',
        text: 'The SI unit of acceleration is:',
        marks: 2,
        options: ['m/s', 'm/s²', 'km/h', 'N'],
        correctAnswer: 'm/s²'
      }
    ],
    status: 'active',
    isPublished: true
  }
];

// Sample evaluations
const evaluations = [
  {
    // Will be populated with actual IDs after creating exams and users
    answers: [
      {
        answer: 'f\'(x) = 9x² - 4x + 5. At x = 2: f\'(2) = 9(4) - 4(2) + 5 = 36 - 8 + 5 = 33',
        marks: 10,
        maxMarks: 10,
        feedback: 'Excellent work! Correct derivative and evaluation.',
        isCorrect: true
      },
      {
        answer: '∫(2x + 3)dx = x² + 3x. From 0 to 4: [16 + 12] - [0] = 28',
        marks: 9,
        maxMarks: 10,
        feedback: 'Very good! Minor notation issue with constant of integration.',
        isCorrect: false
      },
      {
        answer: '1',
        marks: 5,
        maxMarks: 5,
        feedback: 'Correct answer',
        isCorrect: true
      }
    ],
    totalMarks: 24,
    maxMarks: 25,
    percentage: 96,
    grade: 'A+',
    feedback: 'Excellent performance! You have demonstrated mastery of calculus concepts.',
    timeSpent: 110, // minutes
    status: 'completed',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

// Import data
const importData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany();
    await Exam.deleteMany();
    await Evaluation.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log('👥 Created users:', createdUsers.length);

    // Find teacher and students
    const teacher = createdUsers.find(user => user.role === 'teacher');
    const students = createdUsers.filter(user => user.role === 'student');

    // Create exams with teacher reference
    const examsWithTeacher = exams.map(exam => ({
      ...exam,
      createdBy: teacher._id
    }));

    const createdExams = await Exam.create(examsWithTeacher);
    console.log('📝 Created exams:', createdExams.length);

    // Create sample evaluation for first student and first exam
    if (students.length > 0 && createdExams.length > 0) {
      const sampleEvaluation = {
        ...evaluations[0],
        exam: createdExams[0]._id,
        student: students[0]._id,
        answers: evaluations[0].answers.map((answer, index) => ({
          ...answer,
          question: createdExams[0].questions[index]._id
        }))
      };

      await Evaluation.create(sampleEvaluation);
      console.log('📊 Created sample evaluation');
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Users Created:');
    console.log('  Admin: admin@exameval.com / password123');
    console.log('  Teacher: teacher@exameval.com / password123');
    console.log('  Student: student@exameval.com / password123');
    console.log('  Student: emily.davis@exameval.com / password123');
    console.log('  Student: michael.brown@exameval.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    console.log('🗑️  Deleting all data...');
    
    await User.deleteMany();
    await Exam.deleteMany();
    await Evaluation.deleteMany();
    
    console.log('✅ All data deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Connect to database and run seeder
const runSeeder = async () => {
  try {
    await connectDB();
    
    if (process.argv[2] === '-d') {
      await deleteData();
    } else {
      await importData();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1].endsWith('seeder.js')) {
  runSeeder();
}

export { importData, deleteData };