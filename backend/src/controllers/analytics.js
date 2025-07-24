import User from '../models/User.js';
import Exam from '../models/Exam.js';
import Evaluation from '../models/Evaluation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get dashboard statistics
// @route   GET /api/v1/analytics/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  let stats = {};

  if (req.user.role === 'teacher') {
    // Teacher dashboard stats
    const totalExams = await Exam.countDocuments({ createdBy: req.user.id });
    const totalEvaluations = await Evaluation.countDocuments({ evaluatedBy: req.user.id });
    const completedEvaluations = await Evaluation.countDocuments({ 
      evaluatedBy: req.user.id, 
      status: 'completed' 
    });
    
    const avgScore = await Evaluation.aggregate([
      { $match: { evaluatedBy: req.user._id, status: 'completed' } },
      { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } }
    ]);

    stats = {
      totalExams,
      totalEvaluations,
      completedEvaluations,
      averageScore: avgScore[0]?.avgPercentage || 0,
      timeSaved: Math.round(totalEvaluations * 0.5) // Estimate 30 minutes saved per evaluation
    };

  } else if (req.user.role === 'student') {
    // Student dashboard stats
    const totalTests = await Evaluation.countDocuments({ student: req.user.id });
    const completedTests = await Evaluation.countDocuments({ 
      student: req.user.id, 
      status: 'completed' 
    });
    
    const avgScore = await Evaluation.aggregate([
      { $match: { student: req.user._id, status: 'completed' } },
      { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } }
    ]);

    const recentEvaluations = await Evaluation.find({ 
      student: req.user.id, 
      status: 'completed' 
    })
    .sort({ evaluatedAt: -1 })
    .limit(5)
    .populate('exam', 'title subject');

    stats = {
      totalTests,
      completedTests,
      averageScore: avgScore[0]?.avgPercentage || 0,
      recentEvaluations
    };

  } else if (req.user.role === 'admin') {
    // Admin dashboard stats
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalExams = await Exam.countDocuments();
    const totalEvaluations = await Evaluation.countDocuments();

    stats = {
      totalUsers,
      totalTeachers,
      totalStudents,
      totalExams,
      totalEvaluations
    };
  }

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get performance analytics
// @route   GET /api/v1/analytics/performance
// @access  Private
export const getPerformanceAnalytics = asyncHandler(async (req, res, next) => {
  let matchStage = {};

  if (req.user.role === 'teacher') {
    matchStage.evaluatedBy = req.user._id;
  } else if (req.user.role === 'student') {
    matchStage.student = req.user._id;
  }

  // Grade distribution
  const gradeDistribution = await Evaluation.aggregate([
    { $match: { ...matchStage, status: 'completed' } },
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Performance trends over time
  const performanceTrends = await Evaluation.aggregate([
    { $match: { ...matchStage, status: 'completed' } },
    {
      $group: {
        _id: {
          year: { $year: '$evaluatedAt' },
          month: { $month: '$evaluatedAt' }
        },
        averageScore: { $avg: '$percentage' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Subject-wise performance
  const subjectPerformance = await Evaluation.aggregate([
    { $match: { ...matchStage, status: 'completed' } },
    {
      $lookup: {
        from: 'exams',
        localField: 'exam',
        foreignField: '_id',
        as: 'examInfo'
      }
    },
    { $unwind: '$examInfo' },
    {
      $group: {
        _id: '$examInfo.subject',
        averageScore: { $avg: '$percentage' },
        count: { $sum: 1 }
      }
    },
    { $sort: { averageScore: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      gradeDistribution,
      performanceTrends,
      subjectPerformance
    }
  });
});

// @desc    Get subject analytics
// @route   GET /api/v1/analytics/subjects
// @access  Private
export const getSubjectAnalytics = asyncHandler(async (req, res, next) => {
  let matchStage = {};

  if (req.user.role === 'teacher') {
    matchStage.createdBy = req.user._id;
  }

  const subjectStats = await Exam.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$subject',
        examCount: { $sum: 1 },
        totalQuestions: { $sum: { $size: '$questions' } },
        averageMarks: { $avg: '$totalMarks' }
      }
    },
    { $sort: { examCount: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: subjectStats
  });
});

// @desc    Get student progress
// @route   GET /api/v1/analytics/student-progress/:studentId
// @access  Private/Teacher
export const getStudentProgress = asyncHandler(async (req, res, next) => {
  const studentId = req.params.studentId;

  // Verify student exists
  const student = await User.findById(studentId);
  if (!student) {
    return next(new ErrorResponse('Student not found', 404));
  }

  // Get student's evaluation history
  const evaluations = await Evaluation.find({ 
    student: studentId, 
    status: 'completed' 
  })
  .populate('exam', 'title subject examDate')
  .sort({ evaluatedAt: 1 });

  // Calculate progress metrics
  const progressData = evaluations.map(evalu => ({
    date: evalu.evaluatedAt,
    subject: evalu.exam.subject,
    score: evalu.percentage,
    grade: evalu.grade,
    examTitle: evalu.exam.title
  }));

  // Subject-wise progress
  const subjectProgress = {};
  evaluations.forEach(evalu => {
    const subject = evalu.exam.subject;
    if (!subjectProgress[subject]) {
      subjectProgress[subject] = [];
    }
    subjectProgress[subject].push({
      date: evalu.evaluatedAt,
      score: evalu.percentage,
      grade: evalu.grade
    });
  });

  // Overall statistics
  const totalEvaluations = evaluations.length;
  const averageScore = evaluations.reduce((sum, evalu) => sum + evalu.percentage, 0) / totalEvaluations;
  const latestScore = evaluations[evaluations.length - 1]?.percentage || 0;
  const improvement = totalEvaluations > 1 ? latestScore - evaluations[0].percentage : 0;

  res.status(200).json({
    success: true,
    data: {
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      overview: {
        totalEvaluations,
        averageScore: Math.round(averageScore * 100) / 100,
        latestScore,
        improvement: Math.round(improvement * 100) / 100
      },
      progressData,
      subjectProgress
    }
  });
});