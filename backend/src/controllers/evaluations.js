import Evaluation from '../models/Evaluation.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import aiService from '../services/aiService.js';
import emailService from '../services/emailService.js';

// @desc    Get all evaluations
// @route   GET /api/v1/evaluations
// @access  Private (Teacher/Admin)
export const getEvaluations = asyncHandler(async (req, res, next) => {
  let query = {};

  // If user is a teacher, only show their evaluations
  if (req.user.role === 'teacher') {
    const teacherExams = await Exam.find({ createdBy: req.user.id }).select('_id');
    const examIds = teacherExams.map(exam => exam._id);
    query.exam = { $in: examIds };
  }

  // If user is a student, only show their evaluations
  if (req.user.role === 'student') {
    query.student = req.user.id;
  }

  const evaluations = await Evaluation.find(query)
    .populate('student', 'name email rollNumber')
    .populate('exam', 'title subject class duration')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: evaluations.length,
    data: evaluations
  });
});

// @desc    Get single evaluation
// @route   GET /api/v1/evaluations/:id
// @access  Private
export const getEvaluation = asyncHandler(async (req, res, next) => {
  const evaluation = await Evaluation.findById(req.params.id)
    .populate('student', 'name email rollNumber class section')
    .populate('exam', 'title subject class duration questions');

  if (!evaluation) {
    return next(new ErrorResponse('Evaluation not found', 404));
  }

  // Check ownership
  if (req.user.role === 'student' && evaluation.student._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this evaluation', 403));
  }

  if (req.user.role === 'teacher') {
    const exam = await Exam.findById(evaluation.exam._id);
    if (exam.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to access this evaluation', 403));
    }
  }

  res.status(200).json({
    success: true,
    data: evaluation
  });
});

// @desc    Create evaluation (Submit exam answers)
// @route   POST /api/v1/evaluations
// @access  Private (Student)
export const createEvaluation = asyncHandler(async (req, res, next) => {
  const { examId, answers, timeSpent } = req.body;

  // Get exam details
  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new ErrorResponse('Exam not found', 404));
  }

  // Check if student has already submitted
  const existingEvaluation = await Evaluation.findOne({
    exam: examId,
    student: req.user.id
  });

  if (existingEvaluation) {
    return next(new ErrorResponse('You have already submitted this exam', 400));
  }

  // Check if exam is still active
  if (exam.dueDate && new Date() > exam.dueDate) {
    return next(new ErrorResponse('Exam submission deadline has passed', 400));
  }

  // Prepare evaluation data for AI processing
  const evaluationData = [];
  let totalMaxMarks = 0;

  for (let i = 0; i < exam.questions.length; i++) {
    const question = exam.questions[i];
    const answer = answers[i];

    if (question.type === 'subjective' && answer && answer.trim()) {
      evaluationData.push({
        questionId: question._id,
        question: question.text,
        studentAnswer: answer,
        modelAnswer: question.modelAnswer,
        maxMarks: question.marks,
        rubric: question.rubric,
        subject: exam.subject
      });
    }

    totalMaxMarks += question.marks;
  }

  // Perform AI evaluation for subjective questions
  let aiResults = [];
  if (evaluationData.length > 0) {
    try {
      aiResults = await aiService.batchEvaluate(evaluationData);
    } catch (error) {
      console.error('AI evaluation failed:', error);
      // Continue with manual evaluation
    }
  }

  // Prepare question results
  const questionResults = [];
  let totalObtainedMarks = 0;

  for (let i = 0; i < exam.questions.length; i++) {
    const question = exam.questions[i];
    const answer = answers[i];
    let marks = 0;
    let feedback = '';
    let aiEvaluation = null;

    if (question.type === 'mcq') {
      // Multiple choice evaluation
      marks = answer === question.correctAnswer ? question.marks : 0;
      feedback = answer === question.correctAnswer ? 'Correct answer' : `Incorrect. The correct answer is ${question.correctAnswer}`;
    } else if (question.type === 'subjective') {
      // Find AI evaluation result
      aiEvaluation = aiResults.find(result => result.questionId.toString() === question._id.toString());
      
      if (aiEvaluation) {
        marks = aiEvaluation.marks;
        feedback = aiEvaluation.feedback;
      } else {
        // Fallback evaluation
        marks = Math.round(question.marks * 0.5); // Give 50% for submission
        feedback = 'Answer submitted - awaiting manual review';
      }
    }

    questionResults.push({
      question: question._id,
      answer: answer,
      marks: marks,
      maxMarks: question.marks,
      feedback: feedback,
      aiEvaluation: aiEvaluation,
      isCorrect: marks === question.marks
    });

    totalObtainedMarks += marks;
  }

  // Calculate percentage and grade
  const percentage = (totalObtainedMarks / totalMaxMarks) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  // Generate overall feedback using AI
  let overallFeedback = '';
  try {
    const summary = await aiService.generateExamSummary(aiResults);
    overallFeedback = summary.overallFeedback;
  } catch (error) {
    overallFeedback = `You scored ${percentage.toFixed(1)}% on this exam.`;
  }

  // Create evaluation record
  const evaluation = await Evaluation.create({
    exam: examId,
    student: req.user.id,
    answers: questionResults,
    totalMarks: totalObtainedMarks,
    maxMarks: totalMaxMarks,
    percentage: Math.round(percentage * 100) / 100,
    grade: grade,
    feedback: overallFeedback,
    timeSpent: timeSpent,
    status: 'completed',
    submittedAt: new Date()
  });

  // Populate the evaluation for response
  await evaluation.populate('student', 'name email rollNumber');
  await evaluation.populate('exam', 'title subject');

  // Send email notification to student
  try {
    const student = await User.findById(req.user.id);
    await emailService.sendEvaluationComplete(student, exam, evaluation);
  } catch (error) {
    console.error('Failed to send evaluation email:', error);
  }

  res.status(201).json({
    success: true,
    data: evaluation
  });
});

// @desc    Update evaluation (Manual review by teacher)
// @route   PUT /api/v1/evaluations/:id
// @access  Private (Teacher)
export const updateEvaluation = asyncHandler(async (req, res, next) => {
  let evaluation = await Evaluation.findById(req.params.id);

  if (!evaluation) {
    return next(new ErrorResponse('Evaluation not found', 404));
  }

  // Check if teacher owns the exam
  const exam = await Exam.findById(evaluation.exam);
  if (exam.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this evaluation', 403));
  }

  const { answers, feedback, status } = req.body;

  // Update individual question marks if provided
  if (answers && Array.isArray(answers)) {
    let totalObtainedMarks = 0;
    
    evaluation.answers = evaluation.answers.map((answer, index) => {
      if (answers[index]) {
        const updatedAnswer = {
          ...answer.toObject(),
          marks: answers[index].marks !== undefined ? answers[index].marks : answer.marks,
          feedback: answers[index].feedback || answer.feedback,
          manualReview: true
        };
        totalObtainedMarks += updatedAnswer.marks;
        return updatedAnswer;
      }
      totalObtainedMarks += answer.marks;
      return answer;
    });

    // Recalculate totals
    evaluation.totalMarks = totalObtainedMarks;
    evaluation.percentage = Math.round((totalObtainedMarks / evaluation.maxMarks) * 10000) / 100;
    
    // Recalculate grade
    const percentage = evaluation.percentage;
    if (percentage >= 90) evaluation.grade = 'A+';
    else if (percentage >= 80) evaluation.grade = 'A';
    else if (percentage >= 70) evaluation.grade = 'B';
    else if (percentage >= 60) evaluation.grade = 'C';
    else if (percentage >= 50) evaluation.grade = 'D';
    else evaluation.grade = 'F';
  }

  // Update overall feedback if provided
  if (feedback) {
    evaluation.feedback = feedback;
  }

  // Update status if provided
  if (status) {
    evaluation.status = status;
  }

  evaluation.reviewedAt = new Date();
  evaluation.reviewedBy = req.user.id;

  await evaluation.save();

  // Populate for response
  await evaluation.populate('student', 'name email rollNumber');
  await evaluation.populate('exam', 'title subject');

  res.status(200).json({
    success: true,
    data: evaluation
  });
});

// @desc    Delete evaluation
// @route   DELETE /api/v1/evaluations/:id
// @access  Private (Teacher/Admin)
export const deleteEvaluation = asyncHandler(async (req, res, next) => {
  const evaluation = await Evaluation.findById(req.params.id);

  if (!evaluation) {
    return next(new ErrorResponse('Evaluation not found', 404));
  }

  // Check authorization
  if (req.user.role === 'teacher') {
    const exam = await Exam.findById(evaluation.exam);
    if (exam.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this evaluation', 403));
    }
  }

  await evaluation.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get evaluation statistics
// @route   GET /api/v1/evaluations/stats
// @access  Private (Teacher/Admin)
export const getEvaluationStats = asyncHandler(async (req, res, next) => {
  let matchCondition = {};

  // Filter by teacher's exams if not admin
  if (req.user.role === 'teacher') {
    const teacherExams = await Exam.find({ createdBy: req.user.id }).select('_id');
    const examIds = teacherExams.map(exam => exam._id);
    matchCondition.exam = { $in: examIds };
  }

  const stats = await Evaluation.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalEvaluations: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        totalStudents: { $addToSet: '$student' },
        gradeDistribution: {
          $push: '$grade'
        }
      }
    },
    {
      $project: {
        totalEvaluations: 1,
        averageScore: { $round: ['$averageScore', 2] },
        totalStudents: { $size: '$totalStudents' },
        gradeDistribution: 1
      }
    }
  ]);

  // Calculate grade distribution
  let gradeDistribution = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
  if (stats.length > 0 && stats[0].gradeDistribution) {
    stats[0].gradeDistribution.forEach(grade => {
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });
  }

  const result = stats.length > 0 ? {
    ...stats[0],
    gradeDistribution
  } : {
    totalEvaluations: 0,
    averageScore: 0,
    totalStudents: 0,
    gradeDistribution
  };

  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Bulk re-evaluate with AI
// @route   POST /api/v1/evaluations/bulk-reevaluate
// @access  Private (Teacher/Admin)
export const bulkReevaluate = asyncHandler(async (req, res, next) => {
  const { evaluationIds } = req.body;

  if (!evaluationIds || !Array.isArray(evaluationIds)) {
    return next(new ErrorResponse('Please provide evaluation IDs', 400));
  }

  const results = [];

  for (const evaluationId of evaluationIds) {
    try {
      const evaluation = await Evaluation.findById(evaluationId)
        .populate('exam', 'questions subject');

      if (!evaluation) {
        results.push({
          evaluationId,
          status: 'failed',
          error: 'Evaluation not found'
        });
        continue;
      }

      // Check authorization
      if (req.user.role === 'teacher') {
        const exam = await Exam.findById(evaluation.exam._id);
        if (exam.createdBy.toString() !== req.user.id) {
          results.push({
            evaluationId,
            status: 'failed',
            error: 'Not authorized'
          });
          continue;
        }
      }

      // Prepare subjective questions for re-evaluation
      const evaluationData = [];
      evaluation.answers.forEach((answer, index) => {
        const question = evaluation.exam.questions[index];
        if (question && question.type === 'subjective' && answer.answer) {
          evaluationData.push({
            questionId: question._id,
            question: question.text,
            studentAnswer: answer.answer,
            modelAnswer: question.modelAnswer,
            maxMarks: question.marks,
            rubric: question.rubric,
            subject: evaluation.exam.subject
          });
        }
      });

      if (evaluationData.length > 0) {
        const aiResults = await aiService.batchEvaluate(evaluationData);
        
        // Update evaluation with new AI results
        let totalObtainedMarks = 0;
        evaluation.answers = evaluation.answers.map((answer, index) => {
          const question = evaluation.exam.questions[index];
          if (question && question.type === 'subjective') {
            const aiResult = aiResults.find(r => r.questionId.toString() === question._id.toString());
            if (aiResult) {
              answer.marks = aiResult.marks;
              answer.feedback = aiResult.feedback;
              answer.aiEvaluation = aiResult;
            }
          }
          totalObtainedMarks += answer.marks;
          return answer;
        });

        // Recalculate totals
        evaluation.totalMarks = totalObtainedMarks;
        evaluation.percentage = Math.round((totalObtainedMarks / evaluation.maxMarks) * 10000) / 100;
        
        // Recalculate grade
        const percentage = evaluation.percentage;
        if (percentage >= 90) evaluation.grade = 'A+';
        else if (percentage >= 80) evaluation.grade = 'A';
        else if (percentage >= 70) evaluation.grade = 'B';
        else if (percentage >= 60) evaluation.grade = 'C';
        else if (percentage >= 50) evaluation.grade = 'D';
        else evaluation.grade = 'F';

        evaluation.reviewedAt = new Date();
        evaluation.reviewedBy = req.user.id;

        await evaluation.save();

        results.push({
          evaluationId,
          status: 'success',
          newScore: evaluation.percentage,
          newGrade: evaluation.grade
        });
      } else {
        results.push({
          evaluationId,
          status: 'skipped',
          error: 'No subjective questions found'
        });
      }
    } catch (error) {
      results.push({
        evaluationId,
        status: 'failed',
        error: error.message
      });
    }
  }

  res.status(200).json({
    success: true,
    data: results
  });
});