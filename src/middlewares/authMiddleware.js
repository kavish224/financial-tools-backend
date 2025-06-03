import { verifyIdToken, firebaseAdmin } from '../config/firebase.js';

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split(' ')[1];
  try {
    const decodedToken = await verifyIdToken(idToken, true);
    const userRecord = await firebaseAdmin.auth().getUser(decodedToken.uid);
    req.user = userRecord
    next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token has expired, please log in again.' });
    }    
    console.error('Error authenticating user:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
export const authorizeRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden: You do not have permission" });
  }
  next();
};
