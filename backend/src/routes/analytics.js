import express from 'express';
import {
  getDashboardStats,
  getPerformanceAnalytics,
  getSubjectAnalytics,
  getStudentProgress
} from '../controllers/analytics.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/performance', getPerformanceAnalytics);
router.get('/subjects', getSubjectAnalytics);
router.get('/student-progress/:studentId', authorize('teacher', 'admin'), getStudentProgress);

export default router;