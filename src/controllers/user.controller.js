import { firebaseAdmin } from "../config/firebase.js";
import prisma from "../db/prisma.js";

export const syncUser = async (req, res) => {
  const info = req.user;
  
  try {
    const { customClaims } = await firebaseAdmin.auth().getUser(info.uid);
    const role = customClaims?.role || "COMMON_USER"; // Get role from Firebase, default to COMMON_USER

    const user = await prisma.user.upsert({
      where: { firebaseUid: info.uid },
      update: { 
        email: info.email,
        name: info.displayName,
        photoURL: info.photoURL || null,
        lastLogin: new Date(),
        loginCount: { increment: 1 },
        isVerified: info.emailVerified || false,
        phoneNumber: info.phoneNumber || null,
        role, // Keep existing role
      },
      create: { 
        firebaseUid: info.uid,
        email: info.email,
        name: info.displayName,
        photoURL: info.photoURL || null,
        firebaseCreatedAt: new Date(info.metadata.creationTime),
        postgresCreatedAt: new Date(),
        lastLogin: new Date(),
        loginCount: 1,
        isVerified: info.emailVerified || false,
        phoneNumber: info.phoneNumber || null,
        role: "COMMON_USER", // Assign default role
      },
    });

    // Ensure Firebase also has the default role set
    if (!customClaims?.role) {
      await firebaseAdmin.auth().setCustomUserClaims(info.uid, { role: "COMMON_USER" });
    }

    res.status(200).json({ message: "User synced successfully", user });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user with database" });
  }
};
