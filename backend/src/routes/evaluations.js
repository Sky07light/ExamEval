import express from 'express';
import {
  getEvaluations,
  getEvaluation,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationStats
} from '../controllers/evaluations.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getEvaluations)
  .post(createEvaluation);

router
  .route('/stats')
  .get(getEvaluationStats);

router
  .route('/:id')
  .get(getEvaluation)
  .put(updateEvaluation)
  .delete(authorize('teacher', 'admin'), deleteEvaluation);

export default router;