import { firebaseAdmin } from "../config/firebase.js";
import prisma from "../db/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

export const syncUser = async (req, res) => {
  const info = req.user;
  if (!info?.uid) {
    throw ApiError.badRequest("Invalid user information");
  }
  try {
    const firebaseUser = await firebaseAdmin.auth().getUser(info.uid);
    const { customClaims, metadata } = firebaseUser;
    const role = customClaims?.role || "COMMON_USER";
    if (!info.email) {
      throw ApiError.badRequest("User email is required");
    }
    const userData = {
      email: info.email,
      name: info.name || info.displayName || null,
      photoURL: info.picture || info.photoURL || null,
      lastLogin: new Date(),
      isVerified: info.email_verified || info.emailVerified || false,
      phoneNumber: info.phone_number || info.phoneNumber || null,
      role,
    };

    const user = await prisma.user.upsert({
      where: { firebaseUid: info.uid },
      update: {
        ...userData,
        loginCount: { increment: 1 },
      },
      create: {
        firebaseUid: info.uid,
        ...userData,
        firebaseCreatedAt: new Date(metadata.creationTime),
        postgresCreatedAt: new Date(),
        loginCount: 1,
        role: "COMMON_USER",
      },
    });

    if (!customClaims?.role) {
      await firebaseAdmin.auth().setCustomUserClaims(info.uid, { role: "COMMON_USER" });
      logger.info('Set default role for user', { uid: info.uid });
    }

    logger.info('User synced successfully', {
      uid: info.uid,
      email: info.email,
      role: user.role,
      isNewUser: user.loginCount === 1
    });

    res.json(ApiResponse.success(
      {
        user: {
          id: user.id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        }
      },
      "User synced successfully"
    ));
  } catch (error) {
    logger.error("Failed to sync user", {
      uid: info.uid,
      error: error.message
    });

    if (error.code === 'auth/user-not-found') {
      throw ApiError.notFound("Firebase user not found");
    }

    if (error.code?.startsWith('P2')) {
      throw ApiError.internal("Database error during user sync");
    }

    throw ApiError.internal("Failed to sync user with database");
  }
}
