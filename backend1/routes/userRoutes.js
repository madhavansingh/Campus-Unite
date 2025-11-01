import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updatePreferences,
  getMyEvents,
  becomeOrganizer
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All user routes are protected
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/preferences', protect, updatePreferences);
router.get('/my-events', protect, getMyEvents);
router.put('/become-organizer', protect, becomeOrganizer);

export default router;
