import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
import { IS_PRODUCTION } from '../constants.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user?.uid || 'Anonymous'
  });

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = new ApiError(400, message);
  }

  if (err.code === 'P2014') {
    const message = 'Invalid ID provided';
    error = new ApiError(400, message);
  }

  if (err.code === 'P2003') {
    const message = 'Invalid input data';
    error = new ApiError(400, message);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ApiError(400, 'Validation Error', message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ApiError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ApiError(401, message);
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error = new ApiError(500, 'Internal Server Error');
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(error.statusCode === 500 && !IS_PRODUCTION && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
};