export const updateUserRole = async (req, res) => {
    const { uid, role } = req.body;
  
    if (!["ADMIN", "LAWYER", "COMMON_USER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
  
    try {
      // Update Firebase custom claims
      await firebaseAdmin.auth().setCustomUserClaims(uid, { role });
  
      // Update role in PostgreSQL
      await prisma.user.update({
        where: { firebaseUid: uid },
        data: { role },
      });
  
      res.status(200).json({ message: `User role updated to ${role}` });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update role" });
    }
  };
  