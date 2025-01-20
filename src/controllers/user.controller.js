import prisma from "../db/prisma.js";

export const syncUser = async (req, res) => {
  const { uid, email, name, picture } = req.user;

  try {
    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: { email, name, photoURL: picture || null },
      create: { firebaseUid: uid, email, name, photoURL: picture || null },
    });

    res.status(200).json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user with database' });
  }
};