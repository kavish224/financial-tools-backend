import express from 'express';
import { syncUser } from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/sync', authenticateUser, syncUser);

export default router;
