import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync, existsSync } from "fs";
import { logger } from "../utils/logger.js";

dotenv.config();

class FirebaseConfig {
  constructor() {
    this.admin = null;
    this.initialize();
  }

  initialize() {
    try {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

      if (!serviceAccountPath) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH environment variable is required");
      }

      if (!existsSync(serviceAccountPath)) {
        throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
      }

      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

      const requiredFields = ['project_id', 'private_key', 'client_email'];
      for (const field of requiredFields) {
        if (!serviceAccount[field]) {
          throw new Error(`Missing required field '${field}' in service account file`);
        }
      }

      this.admin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });

      logger.info('Firebase Admin SDK initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Firebase Admin SDK:', error);
      throw error;
    }
  }

  async verifyIdToken(idToken) {
    try {
      if (!idToken || typeof idToken !== 'string') {
        throw new Error('Invalid token format');
      }

      const decodedToken = await this.admin.auth().verifyIdToken(idToken, true);
      return decodedToken;
    } catch (error) {
      logger.error('Token verification failed:', {
        error: error.message,
        code: error.code
      });

      // Map Firebase errors to meaningful messages
      const errorMessages = {
        'auth/id-token-expired': 'Token has expired',
        'auth/id-token-revoked': 'Token has been revoked',
        'auth/invalid-id-token': 'Invalid token format',
        'auth/user-disabled': 'User account has been disabled',
        'auth/user-not-found': 'User not found'
      };

      const message = errorMessages[error.code] || 'Token verification failed';
      throw new Error(message);
    }
  }

  getAdmin() {
    if (!this.admin) {
      throw new Error('Firebase Admin not initialized');
    }
    return this.admin;
  }
}

const firebaseConfig = new FirebaseConfig();

export const verifyIdToken = (idToken) => firebaseConfig.verifyIdToken(idToken);
export const firebaseAdmin = firebaseConfig.getAdmin();
