import dotenv from "dotenv";
import { connectDB } from "./db/index.js"; // Import the connectDB function
import { app } from "./app.js"; // Import your Express app

dotenv.config({ path: "./.env" }); // Load environment variables

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to start the server:", err.message);
})



 