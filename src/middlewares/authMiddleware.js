import { verifyIdToken } from '../config/firebase.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';

export const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization header with Bearer token required');
  }
  const idToken = authHeader.split(' ')[1];
  if (!idToken) {
    throw new ApiError(401, 'Token not provided');
  }
  try {
    const decodedToken = await verifyIdToken(idToken);
    req.user = decodedToken;
    logger.debug('User authenticated successfully', {
      uid: decodedToken.uid,
      email: decodedToken.email
    });
    next();
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    if (error.message.includes('expired')) {
      throw new ApiError(401, 'Token has expired, please log in again');
    }
    throw new ApiError(401, 'Invalid authentication token');
  }
});
export const authorizeRole = (allowedRoles) => (req, res, next) => {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new Error('allowedRoles must be a non-empty array');
  }

  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'User not authenticated');
    }

    const userRole = req.user.role || 'COMMON_USER';

    if (!allowedRoles.includes(userRole)) {
      logger.warn('Authorization failed', {
        uid: req.user.uid,
        userRole,
        requiredRoles: allowedRoles,
        endpoint: req.path
      });

      throw new ApiError(403, 'Insufficient permissions to access this resource');
    }

    next();
  });
};
