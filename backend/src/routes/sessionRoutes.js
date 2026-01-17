
import express from 'express';
import { getSessions, createSession, getSessionById } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSessions);
router.post('/', protect, createSession);
router.get('/:id', protect, getSessionById);

export default router;
