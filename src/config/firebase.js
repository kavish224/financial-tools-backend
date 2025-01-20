import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

import { readFileSync } from "fs";

const serviceAccountPath ="/Users/kavishambani/Downloads/project1-5df84-firebase-adminsdk-zxs7s-1053f0bcc1.json";

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
} catch (error) {
  throw new Error(`Failed to load Firebase service account: ${error.message}`);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
};
export const firebaseAdmin = admin;
