import { firebaseAdmin } from "../config/firebase.js";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";
const VALID_ROLES = ["ADMIN", "ADVISOR", "COMMON_USER"];
export const updateUserRole = async (req, res) => {
  const { uid, role } = req.body;
  const adminUser = req.user;

  if (!uid || !role) {
    throw ApiError.badRequest("User ID and role are required");
  }

  if (!VALID_ROLES.includes(role)) {
    throw ApiError.badRequest(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
  }

  if (adminUser.uid === uid && role !== 'ADMIN') {
    throw ApiError.forbidden("Cannot modify your own admin role");
  }

  try {
    await firebaseAdmin.auth().setCustomUserClaims(uid, { role });

    const updatedUser = await prisma.user.update({
      where: { firebaseUid: uid },
      data: {
        role,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    logger.info('User role updated successfully', {
      adminUid: adminUser.uid,
      targetUid: uid,
      oldRole: existingUser.role,
      newRole: role,
      targetEmail: updatedUser.email
    });

    res.json(ApiResponse.success(
      {
        user: updatedUser
      },
      `User role updated to ${role} successfully`
    ));

  } catch (error) {
    logger.error('Failed to update user role', {
      adminUid: adminUser.uid,
      targetUid: uid,
      role,
      error: error.message
    });

    if (error.code === 'auth/user-not-found') {
      throw ApiError.notFound("User not found in Firebase");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal("Failed to update user role");
  }
};
