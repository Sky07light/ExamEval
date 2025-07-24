import Evaluation from '../models/Evaluation.js';
import Exam from '../models/Exam.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all evaluations
// @route   GET /api/v1/evaluations
// @access  Private
export const getEvaluations = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let query = {};

  // Filter based on user role
  if (req.user.role === 'student') {
    query.student = req.user.id;
  } else if (req.user.role === 'teacher') {
    query.evaluatedBy = req.user.id;
  }

  // Additional filters
  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.exam) {
    query.exam = req.query.exam;
  }

  if (req.query.grade) {
    query.grade = req.query.grade;
  }

  const evaluations = await Evaluation.find(query)
    .populate('exam', 'title subject class section')
    .populate('student', 'name email rollNumber')
    .populate('evaluatedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  const total = await Evaluation.countDocuments(query);

  res.status(200).json({
    success: true,
    count: evaluations.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: evaluations
  });
});

// @desc    Get single evaluation
// @route   GET /api/v1/evaluations/:id
// @access  Private
export const getEvaluation = asyncHandler(async (req, res, next) => {
  const evaluation = await Evaluation.findById(req.params.id)
    .populate('exam', 'title subject class section questions')
    .populate('student', 'name email rollNumber')
    .populate('evaluatedBy', 'name email');

  if (!evaluation) {
    return next(new ErrorResponse('Evaluation not found', 404));
  }

  // Check access permissions
  const hasAccess = 
    req.user.role === 'admin' ||
    evaluation.student._id.toString() === req.user.id ||
    evaluation.evaluatedBy._id.toString() === req.user.id;

  if (!hasAccess) {
    return next(new ErrorResponse('Not authorized to access this evaluation', 403));
  }

  res.status(200).json({
    success: true,
    data: evaluation
  });
});

// @desc    Create new evaluation
// @route   POST /api/v1/evaluations
// @access  Private
export const createEvaluation = asyncHandler(async (req, res, next) => {
  const { examId, studentId, answers } = req.body;

  // Verify exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new ErrorResponse('Exam not found', 404));
  }

  // Check if evaluation already exists
  const existingEvaluation = await Evaluation.findOne({
    exam: examId,
    student: studentId || req.user.id
  });

  if (existingEvaluation) {
    return next(new ErrorResponse('Evaluation already exists for this exam and student', 400));
  }

  // Calculate total marks
  let totalMarksAwarded = 0;
  let totalMaxMarks = 0;

  const processedAnswers = answers.map(answer => {
    const question = exam.questions.find(q => q.questionNumber === answer.questionNumber);
    if (question) {
      totalMaxMarks += question.marks;
      totalMarksAwarded += answer.marksAwarded || 0;
    }
    return answer;
  });

  const evaluationData = {
    exam: examId,
    student: studentId || req.user.id,
    evaluatedBy: req.user.id,
    answers: processedAnswers,
    totalMarksAwarded,
    totalMaxMarks,
    status: 'completed'
  };

  const evaluation = await Evaluation.create(evaluationData);

  res.status(201).json({
    success: true,
    data: evaluation
  });
});

// @desc    Update evaluation
// @route   PUT /api/v1/evaluations/:id
// @access  Private
export const updateEvaluation = asyncHandler(async (req, res, next) => {
  let evaluation = await Evaluation.findById(req.params.id);

  if (!evaluation) {
    return next(new ErrorResponse('Evaluation not found', 404));
  }

  // Check permissions
  const canUpdate = 
    req.user.role === 'admin' ||
    evaluation.evaluatedBy.toString() === req.user.id;

  if (!canUpdate) {
    return next(new ErrorResponse('Not authorized to update this evaluation', 403));
  }

  evaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: evaluation
  });
});

// @desc    Delete evaluation
// @route   DELETE /api/v1/evaluations/:id
// @access  Private/Teacher
export const deleteEvaluation = asyncHandler(async (req, res, next) => {
  const evaluation = await Evaluation.findById(req.params.id);

  if (!evaluation) {
    return next(new ErrorResponse('Evaluation not found', 404));
  }

  // Check permissions
  const canDelete = 
    req.user.role === 'admin' ||
    evaluation.evaluatedBy.toString() === req.user.id;

  if (!canDelete) {
    return next(new ErrorResponse('Not authorized to delete this evaluation', 403));
  }

  await evaluation.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Evaluation deleted successfully'
  });
});

// @desc    Get evaluation statistics
// @route   GET /api/v1/evaluations/stats
// @access  Private
export const getEvaluationStats = asyncHandler(async (req, res, next) => {
  let matchStage = {};

  // Filter based on user role
  if (req.user.role === 'student') {
    matchStage.student = req.user._id;
  } else if (req.user.role === 'teacher') {
    matchStage.evaluatedBy = req.user._id;
  }

  const stats = await Evaluation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalEvaluations: { $sum: 1 },
        averagePercentage: { $avg: '$percentage' },
        completedEvaluations: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  const gradeDistribution = await Evaluation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const performanceStats = await Evaluation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$performanceLevel',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {
        totalEvaluations: 0,
        averagePercentage: 0,
        completedEvaluations: 0
      },
      gradeDistribution,
      performanceStats
    }
  });
});