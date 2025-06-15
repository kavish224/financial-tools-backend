import express from 'express';
import { syncUser } from '../controllers/user.controller.js';
import { authenticateUser, authorizeRole } from '../middlewares/authMiddleware.js';
import { updateUserRole } from '../controllers/role.controller.js';
import { validate, schemas } from '../utils/validation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../db/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

router.post('/sync', authenticateUser, syncUser);
router.post("/update-role", authenticateUser, authorizeRole(["ADMIN"]), validate(schemas.updateRole), updateUserRole);
router.get('/profile', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        photoURL: true,
        lastLogin: true,
        loginCount: true,
        firebaseCreatedAt: true
      }
    });

    if (!user) {
      throw ApiError.notFound("User profile not found");
    }

    res.json(ApiResponse.success(user, "Profile retrieved successfully"));
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}));

export default router;
