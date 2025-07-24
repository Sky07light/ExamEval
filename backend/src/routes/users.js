import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/users.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'teacher'), getUsers)
  .post(authorize('admin'), createUser);

router
  .route('/stats')
  .get(getUserStats);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;