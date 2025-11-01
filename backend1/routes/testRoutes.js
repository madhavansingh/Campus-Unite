import express from 'express';
import { testProtected } from '../controllers/testController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/protected', protect, testProtected);

export default router;
