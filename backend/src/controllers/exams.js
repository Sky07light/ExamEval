import Exam from '../models/Exam.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all exams
// @route   GET /api/v1/exams
// @access  Private
export const getExams = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let query = {};

  // Filter by creator for teachers
  if (req.user.role === 'teacher') {
    query.createdBy = req.user.id;
  }

  // Additional filters
  if (req.query.subject) {
    query.subject = { $regex: req.query.subject, $options: 'i' };
  }

  if (req.query.class) {
    query.class = req.query.class;
  }

  if (req.query.section) {
    query.section = req.query.section;
  }

  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  const exams = await Exam.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  const total = await Exam.countDocuments(query);

  res.status(200).json({
    success: true,
    count: exams.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: exams
  });
});

// @desc    Get single exam
// @route   GET /api/v1/exams/:id
// @access  Private
export const getExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id).populate('createdBy', 'name email');

  if (!exam) {
    return next(new ErrorResponse('Exam not found', 404));
  }

  // Check if user has access to this exam
  if (req.user.role === 'teacher' && exam.createdBy._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this exam', 403));
  }

  res.status(200).json({
    success: true,
    data: exam
  });
});

// @desc    Create new exam
// @route   POST /api/v1/exams
// @access  Private/Teacher
export const createExam = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const exam = await Exam.create(req.body);

  res.status(201).json({
    success: true,
    data: exam
  });
});

// @desc    Update exam
// @route   PUT /api/v1/exams/:id
// @access  Private/Teacher
export const updateExam = asyncHandler(async (req, res, next) => {
  let exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new ErrorResponse('Exam not found', 404));
  }

  // Make sure user is exam owner
  if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this exam', 403));
  }

  exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: exam
  });
});

// @desc    Delete exam
// @route   DELETE /api/v1/exams/:id
// @access  Private/Teacher
export const deleteExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new ErrorResponse('Exam not found', 404));
  }

  // Make sure user is exam owner
  if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this exam', 403));
  }

  await exam.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Exam deleted successfully'
  });
});

// @desc    Get exam statistics
// @route   GET /api/v1/exams/stats
// @access  Private
export const getExamStats = asyncHandler(async (req, res, next) => {
  let matchStage = {};

  // Filter by creator for teachers
  if (req.user.role === 'teacher') {
    matchStage.createdBy = req.user._id;
  }

  const stats = await Exam.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalExams: { $sum: 1 },
        activeExams: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        totalQuestions: { $sum: { $size: '$questions' } },
        averageMarks: { $avg: '$totalMarks' }
      }
    }
  ]);

  const subjectStats = await Exam.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$subject',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {
        totalExams: 0,
        activeExams: 0,
        totalQuestions: 0,
        averageMarks: 0
      },
      bySubject: subjectStats
    }
  });
});