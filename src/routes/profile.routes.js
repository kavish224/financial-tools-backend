import express from 'express';
import { syncUser } from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRole } from "../middlewares/authMiddleware.js";
import { updateUserRole } from '../controllers/role.controller.js';

const router = express.Router();

router.post('/sync', authenticateUser, syncUser);
router.post("/update-role", authenticateUser, authorizeRole(["ADMIN"]), updateUserRole);

export default router;
