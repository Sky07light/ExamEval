import express from 'express';
import {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  getExamStats
} from '../controllers/exams.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getExams)
  .post(authorize('teacher', 'admin'), createExam);

router
  .route('/stats')
  .get(getExamStats);

router
  .route('/:id')
  .get(getExam)
  .put(authorize('teacher', 'admin'), updateExam)
  .delete(authorize('teacher', 'admin'), deleteExam);

export default router;